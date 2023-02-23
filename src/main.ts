import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as tools from './command-line-tools'
import {getDiffBetweenCommitAndHead} from './diff'

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

  return cachePath
}

async function loadDiffSoFancy(): Promise<void> {
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
}

async function run(): Promise<void> {
  try {
    await loadDiffSoFancy()
    const commitHash: string = core.getInput('commit-hash')
    let diff = ''

    if (await tools.doesCommitExist(commitHash)) {
      diff = await getDiffBetweenCommitAndHead(commitHash)
    } else {
      core.setFailed(`Commit ${commitHash} wasn't found.`)
    }

    core.setOutput('diff', diff)
    core.info(diff)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
