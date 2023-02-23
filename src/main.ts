import * as core from '@actions/core'
import * as tools from './command-line-tools'
import {getDiffBetweenCommitAndHead} from './diff'

async function run(): Promise<void> {
  try {
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
