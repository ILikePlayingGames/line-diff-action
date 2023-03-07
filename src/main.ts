import * as core from '@actions/core'
import {writeFileSync} from 'fs'
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

    const path = `./diff.txt`
    core.debug(`Writing diff to ${path}`)
    writeFileSync(path, diff)
    core.info(`Wrote diff to ${path}`)
  } catch (e) {
    core.setFailed(e instanceof Error ? e.message : JSON.stringify(e))
  }
}

run()
