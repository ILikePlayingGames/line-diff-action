import * as exec from '@actions/exec'
import * as core from '@actions/core'

export async function setupDiffSoFancy(): Promise<void> {
  // Setup git to use diff-so-fancy
  await execCommands([
    'git config --local core.pager "diff-so-fancy | less --tabs=4 -RFX',
    'git config --local interactive.diffFilter "diff-so-fancy --patch"'
  ])

  // Setup colours
  await execCommands([
    'git config --local color.ui true',
    'git config --local color.diff-highlight.oldNormal    "red bold"',
    'git config --local color.diff-highlight.oldHighlight "red bold 52"',
    'git config --local color.diff-highlight.newNormal    "green bold"',
    'git config --local color.diff-highlight.newHighlight "green bold 22"',
    'git config --local color.diff.meta       "11"',
    'git config --local color.diff.frag       "magenta bold"',
    'git config --local color.diff.func       "146 bold"',
    'git config --local color.diff.commit     "yellow bold"',
    'git config --local color.diff.old        "red bold"',
    'git config --local color.diff.new        "green bold"',
    'git config --local color.diff.whitespace "red reverse"'
  ])
}

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

/**
 * Executes a list of command line commands.
 * Command output isn't captured, use only commands where the
 * output isn't required.
 *
 * @param commands the commands to execute
 */
async function execCommands(commands: string[]): Promise<void> {
  for (const command of commands) {
    const commandOutput: exec.ExecOutput = await exec.getExecOutput(command)
    if (commandOutput.exitCode !== 0) {
      throw new Error(commandOutput.stderr)
    }
  }
}
