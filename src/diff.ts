import * as exec from '@actions/exec'
export async function getDiffBetweenCommits(
  hashOne: string,
  hashTwo: string
): Promise<string> {
  const getDiffOutput: exec.ExecOutput = await exec.getExecOutput(
    /*
    Workaround for @actions/exec not supporting pipes
    Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
     */
    `/bin/bash -c "git diff -u ${hashOne} ${hashTwo} | diff-so-fancy"`
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
