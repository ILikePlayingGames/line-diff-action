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

export async function makeFileExecutable(path: string): Promise<void> {
  await exec.exec(`chmod +x ${path}`)
}

export async function setRulerWidth(rulerWidth: number): Promise<void> {
  await exec.exec(`git config --global diff-so-fancy.rulerWidth ${rulerWidth}`)
}

/**
 * Executes a list of command line commands.
 * Command output isn't captured, use only commands where the
 * output isn't required.
 *
 * @param commands the commands to execute
 */
export async function execCommands(commands: string[]): Promise<void> {
  for (const command of commands) {
    const commandOutput: exec.ExecOutput = await exec.getExecOutput(command)
    core.debug(commandOutput.stdout)
    if (commandOutput.exitCode !== 0) {
      throw new Error(commandOutput.stderr)
    }
  }
}
