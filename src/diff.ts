import * as exec from '@actions/exec'
export async function getDiff(hash: string): Promise<string> {
  const getDiffOutput: exec.ExecOutput = await exec.getExecOutput(
    `git diff ${hash} HEAD`
  )
  if (getDiffOutput.exitCode !== 0) {
    throw new Error(getDiffOutput.stderr)
  }

  return getDiffOutput.stdout
}
