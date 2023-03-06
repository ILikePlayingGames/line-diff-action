import * as exec from '@actions/exec'

export async function getDiffBetweenCommits(
  hashOne: string,
  hashTwo: string,
  diffAlgorithm: string
): Promise<string> {
  let args = `${hashOne} ${hashTwo}`

  if (diffAlgorithm !== '') {
    args = `${args} --diff-algorithm=`
  }

  const getDiffOutput: exec.ExecOutput = await exec.getExecOutput(
    /*
    Workaround for @actions/exec not supporting pipes
    Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
     */
    `/bin/bash -c "git diff -p ${args} | delta"`
  )
  if (getDiffOutput.exitCode !== 0) {
    throw new Error(getDiffOutput.stderr)
  }

  return getDiffOutput.stdout
}
