import * as exec from '@actions/exec'

export async function getDiffBetweenCommits(
  hashOne: string,
  hashTwo: string,
  diffAlgorithm: string,
  columnWidth?: number,
  rulerWidth?: number
): Promise<string> {
  let args = `${hashOne} ${hashTwo}`

  if (diffAlgorithm !== '') {
    args = `${args}`
  }
  if (columnWidth !== undefined) {
    args = `${args}`
  }
  if (rulerWidth !== undefined) {
    args = `${args} -w ${rulerWidth}`
  }

  const getDiffOutput: exec.ExecOutput = await exec.getExecOutput(
    /*
    Workaround for @actions/exec not supporting pipes
    Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
     */
    `git diff ${args}`
  )
  if (getDiffOutput.exitCode !== 0) {
    throw new Error(getDiffOutput.stderr)
  }

  return getDiffOutput.stdout
}
