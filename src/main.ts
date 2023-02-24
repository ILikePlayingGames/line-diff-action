import * as core from '@actions/core'
import * as tools from './command-line-tools'
import {getDiffBetweenCommits} from './diff'
import {
  parseInt,
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
      parseInt('ruler-width', core.getInput('ruler-width'))
    )
    await loadDiffSoFancy(rulerWidth)

    let diff = ''

    if (await tools.doesCommitExist(commitHash)) {
      if (await tools.doesCommitExist(secondCommitHash)) {
        // diff-so-fancy needs this variable for ANSI
        // It's not defined on GitHub runners
        if (process.env.RUNNER_OS !== undefined) {
          process.env.TERM = 'xterm-256color'
        }
        diff = await getDiffBetweenCommits(
          commitHash,
          secondCommitHash,
          diffAlgorithm,
          columnWidth,
          rulerWidth
        )
      } else {
        core.setFailed(`Commit ${secondCommitHash} wasn't found.`)
        return
      }
    } else {
      core.setFailed(`Commit ${commitHash} wasn't found.`)
      return
    }

    core.setOutput('diff', diff)
    core.info(diff)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
