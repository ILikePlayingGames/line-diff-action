import * as core from '@actions/core'
import * as tools from './command-line-tools'
import {getDiff} from './diff'

async function run(): Promise<void> {
  try {
    await tools.setupDiffSoFancy()
    core.debug('diff-so-fancy setup successfully')

    const commitHash: string = core.getInput('commit-hash')
    let diff = ''

    if (await tools.doesCommitExist(commitHash)) {
      diff = await getDiff(commitHash)
    }

    core.setOutput('diff', diff)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
