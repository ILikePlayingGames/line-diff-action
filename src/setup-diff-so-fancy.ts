import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import * as tools from './command-line-tools'
import {setRulerWidth} from './command-line-tools'

async function downloadDiffSoFancy(): Promise<string> {
  const diffSoFancyPath = await tc.downloadTool(
    'https://github.com/so-fancy/diff-so-fancy/releases/download/v1.4.3/diff-so-fancy'
  )
  core.debug(`diff-so-fancy download path: ${diffSoFancyPath}`)

  const cachePath = await tc.cacheFile(
    diffSoFancyPath,
    'diff-so-fancy',
    'diff-so-fancy',
    '1.4.3'
  )
  core.debug(`cache path: ${cachePath}`)
  await tools.makeFileExecutable(`${cachePath}/diff-so-fancy`)

  return cachePath
}

export async function loadDiffSoFancy(rulerWidth?: number): Promise<void> {
  let diffSoFancyDir = tc.find('diff-so-fancy', '1.4.3')

  if (diffSoFancyDir !== '') {
    core.debug(`diff-so-fancy found at ${diffSoFancyDir}`)
  }

  if (diffSoFancyDir === '') {
    core.info(`diff-so-fancy not found in cache, downloading...`)
    diffSoFancyDir = await downloadDiffSoFancy()
    core.info(`download finished`)
  }
  core.addPath(diffSoFancyDir)

  if (rulerWidth) {
    try {
      await setRulerWidth(rulerWidth)
    } catch (error) {
      throw new Error(
        `Setting ruler width failed with message ${(error as Error)?.message}`
      )
    }
  }
}
