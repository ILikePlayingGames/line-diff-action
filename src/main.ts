import * as core from '@actions/core'
import {getDiffBetweenCommits} from './diff'
import {
  validateColumnWidth,
  validateDiffAlgorithm,
  validateRef,
  validateRulerWidth
} from './input-validation'
import {loadDiffSoFancy} from './setup-diff-so-fancy'

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
    const columnWidth: number = validateColumnWidth(
      core.getInput('column-width')
    )
    const rulerWidth: number | undefined = validateRulerWidth(
      columnWidth,
      core.getInput('ruler-width')
    )
    await loadDiffSoFancy(rulerWidth)

    const diff = await getDiffBetweenCommits(
      commitHash,
      secondCommitHash,
      diffAlgorithm,
      columnWidth,
      rulerWidth
    )

    core.setOutput('diff', diff)
    core.info(diff)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
