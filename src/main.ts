import * as core from '@actions/core'
import { writeDiffToFile } from './diff.js'
import { validateDiffAlgorithm, validateRef } from './input-validation.js'
import { loadDelta } from './setup-delta.js'

async function run(): Promise<void> {
  try {
    const commitHash: string = validateRef(
      'commit-hash',
      core.getInput('commit-hash', {
        required: true,
      }),
    )
    const secondCommitHash: string = validateRef(
      'second-commit-hash',
      core.getInput('second-commit-hash'),
    )
    const diffAlgorithm: string = validateDiffAlgorithm(
      core.getInput('diff-algorithm'),
    )
    const deltaTheme: string = core.getInput('delta-theme')
    core.info(`First Hash: ${commitHash}`)
    core.info(`Second Hash: ${secondCommitHash}`)
    core.info(`Diff Algorithm: ${diffAlgorithm}`)

    await loadDelta(deltaTheme)
    core.info('Delta setup complete')

    const outputPath: string = core.getInput('output-path')
    await writeDiffToFile(commitHash, secondCommitHash, diffAlgorithm, outputPath)
  }
  catch (e) {
    core.setFailed(e instanceof Error ? e.message : JSON.stringify(e))
  }
}

run()
