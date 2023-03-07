import * as core from '@actions/core'
import * as fs from 'fs/promises'
import {getDiffBetweenCommits} from './diff'
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
    await loadDelta()

    const diff = await getDiffBetweenCommits(
      commitHash,
      secondCommitHash,
      diffAlgorithm
    )

    const path = `${process.env.HOME}/diff.txt`
    await fs.writeFile(path, diff)
    core.info(`Wrote diff to ${path}`)
    core.info(`\nDiff Preview:`)
    core.info(diff)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
