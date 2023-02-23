import * as exec from '@actions/exec'
import * as core from '@actions/core'

export async function doesCommitExist(hash: string): Promise<boolean> {
  let commitExistsOutput: exec.ExecOutput
  try {
    commitExistsOutput = await exec.getExecOutput(
      `git merge-base --is-ancestor ${hash} HEAD`
    )
  } catch (error) {
    // It can also throw an error if it doesn't exist.
    if ((error as Error)?.message !== undefined) {
      core.debug((error as Error)?.message)
    }
    return false
  }

  return commitExistsOutput.exitCode === 0
}
