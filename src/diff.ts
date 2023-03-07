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

  let diffOutput: exec.ExecOutput

  if (process.platform === 'win32') {
    diffOutput = await exec.getExecOutput(
      /*
      Workaround for @actions/exec not supporting pipes
      Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
      */
      `powershell -Command "git diff ${args} | delta"`
    )
  } else {
    diffOutput = await exec.getExecOutput(
      /*
      Workaround for @actions/exec not supporting pipes
      Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
       */
      `/bin/bash -c "git diff ${args} | delta"`
    )
  }

  if (diffOutput.exitCode !== 0) {
    throw new Error(diffOutput.stderr)
  }

  return diffOutput.stdout
}
