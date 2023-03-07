import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {toPlatformPath} from '@actions/core'
import * as fs from 'fs'

export async function writeDiffToFile(
  hashOne: string,
  hashTwo: string,
  diffAlgorithm: string,
  filePath: string
): Promise<void> {
  let args = `'${hashOne}' '${hashTwo}'`

  if (diffAlgorithm !== 'default') {
    args = `${args} --diff-algorithm=${diffAlgorithm}`
  }
  core.debug(`Diff arguments: '${args}'`)

  const platformPath = toPlatformPath(filePath)
  core.info(`Writing diff to ${platformPath}`)
  if (process.platform === 'win32') {
    await exec.exec(
      /*
        Workaround for @actions/exec not supporting pipes
        Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
        */
      `powershell -Command git diff ${args} | delta | tee -FilePath '${platformPath}'`
    )
  } else {
    await exec.exec(
      /*
        Workaround for @actions/exec not supporting pipes
        Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
         */
      `/bin/bash -c "git diff ${args} | delta | tee ${platformPath}"`
    )
  }

  const status = fs.statSync(filePath)

  if (status.isFile()) {
    let data: string

    try {
      data = fs.readFileSync(filePath, {encoding: 'utf-8'})
      fs.writeFileSync(filePath, data.trim())
    } catch (e) {
      return Promise.reject(e)
    }

    if (!data.trim().startsWith('[4;38;5;34m')) {
      return Promise.reject(
        new Error(`Diff file has unexpected content:\n${data}`)
      )
    }
  } else {
    return Promise.reject(new Error(`${filePath} is not a file`))
  }

  core.info('Diff file written successfully')
  return Promise.resolve()
}
