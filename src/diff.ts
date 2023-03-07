import * as exec from '@actions/exec'

export async function getDiffBetweenCommits(
  hashOne: string,
  hashTwo: string,
  diffAlgorithm: string
): Promise<string> {
  let args = `${hashOne} ${hashTwo}`

  if (diffAlgorithm !== 'default') {
    args = `${args} --diff-algorithm=${diffAlgorithm}`
  }

  let diffOutput: exec.ExecOutput

  if (process.platform === 'win32') {
    diffOutput = await exec.getExecOutput(
      /*
        Workaround for @actions/exec not supporting pipes
        Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
        */
      `cmd /c git diff ${args} | delta`
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

  // Since I'm running bash, then running the command, it eats the exit code.
  // Use the ANSI colours before the diff file name to check for success.
  if (diffOutput.stdout.includes('[4;38;5;34m')) {
    return Promise.resolve(diffOutput.stdout)
  } else {
    return Promise.reject(diffOutput.stderr)
  }
}
