import * as exec from '@actions/exec'
export async function getDiffBetweenCommits(
  hashOne: string,
  hashTwo: string
): Promise<string> {
  const getDiffOutput: exec.ExecOutput = await exec.getExecOutput(
    `git diff ${hashOne} ${hashTwo}`
  )
  if (getDiffOutput.exitCode !== 0) {
    throw new Error(getDiffOutput.stderr)
  }

  return getDiffOutput.stdout
}

export async function getDiffBetweenCommitAndHead(
  hash: string
): Promise<string> {
  return getDiffBetweenCommits(hash, 'HEAD')
}
