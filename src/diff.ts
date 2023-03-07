import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {toPlatformPath} from '@actions/core'
import * as fs from 'fs'

function verifyDiffFile(filePath: string): void {
  const status = fs.statSync(filePath)

  if (status.isFile()) {
    const data = fs.readFileSync(filePath, {encoding: 'utf-8'})
    fs.writeFileSync(filePath, data.trim())

    if (!data.trim().startsWith('[4;38;5;34m')) {
      throw new Error(`Diff file has unexpected content:\n${data}`)
    }
  } else {
    throw new Error(`${filePath} is not a file`)
  }
}

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

  try {
    verifyDiffFile(platformPath)
    core.info('Diff file written successfully')
    return Promise.resolve()
  } catch (e) {
    return Promise.reject(e)
  }
}
