import * as core from '@actions/core'
import {writeDiffToFile} from './diff'
import {validateDiffAlgorithm, validateRef} from './input-validation'
import {loadDelta} from './setup-delta'

async function run(): Promise<void> {
  try {
    const commitHash: string = validateRef(
      'commit-hash',
      core.getInput('commit-hash')
    )
    const secondCommitHash: string = validateRef(
      'second-commit-hash',
      core.getInput('second-commit-hash')
    )
    const diffAlgorithm: string = validateDiffAlgorithm(
      core.getInput('diff-algorithm')
    )
    core.info(`First Hash: ${commitHash}`)
    core.info(`Second Hash: ${secondCommitHash}`)
    core.info(`Diff Algorithm: ${diffAlgorithm}`)

    await loadDelta()
    core.info('Delta setup complete')

    const path = `${process.env.HOME}/diff.txt`
    await writeDiffToFile(commitHash, secondCommitHash, diffAlgorithm, path)
  } catch (e) {
    core.setFailed(e instanceof Error ? e.message : JSON.stringify(e))
  }
}

run()
