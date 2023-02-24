import * as exec from '@actions/exec'
import {setRulerWidth} from './command-line-tools'

export async function getDiffBetweenCommits(
  hashOne: string,
  hashTwo: string,
  diffAlgorithm: string,
  columnWidth?: number,
  rulerWidth?: number
): Promise<string> {
  let args = `-u ${hashOne} ${hashTwo}`

  if (diffAlgorithm !== '') {
    args = `${args} --diff-algorithm=${diffAlgorithm}`
  }
  if (columnWidth !== undefined) {
    args = `${args} --stat=${columnWidth}`
  }
  if (rulerWidth !== undefined) {
    await setRulerWidth(rulerWidth)
  }

  const getDiffOutput: exec.ExecOutput = await exec.getExecOutput(
    /*
    Workaround for @actions/exec not supporting pipes
    Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
     */
    `/bin/bash -c "git diff ${args} | diff-so-fancy"`
  )
  if (getDiffOutput.exitCode !== 0) {
    throw new Error(getDiffOutput.stderr)
  }

  return getDiffOutput.stdout
}
