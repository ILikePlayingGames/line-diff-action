import * as exec from '@actions/exec'

export async function setupDiffSoFancy(): Promise<void> {
  // Setup git to use diff-so-fancy
  await execCommands([
    'git config --global core.pager "diff-so-fancy | less --tabs=4 -RFX',
    'git config --global interactive.diffFilter "diff-so-fancy --patch"'
  ])

  // Setup colours
  await execCommands([
    'git config --global color.ui true',
    'git config --global color.diff-highlight.oldNormal    "red bold"',
    'git config --global color.diff-highlight.oldHighlight "red bold 52"',
    'git config --global color.diff-highlight.newNormal    "green bold"',
    'git config --global color.diff-highlight.newHighlight "green bold 22"',
    'git config --global color.diff.meta       "11"',
    'git config --global color.diff.frag       "magenta bold"',
    'git config --global color.diff.func       "146 bold"',
    'git config --global color.diff.commit     "yellow bold"',
    'git config --global color.diff.old        "red bold"',
    'git config --global color.diff.new        "green bold"',
    'git config --global color.diff.whitespace "red reverse"'
  ])
}

export async function doesCommitExist(hash: string): Promise<boolean> {
  const commitExistsOutput: exec.ExecOutput = await exec.getExecOutput(
    `git merge-base --is-ancestor ${hash} HEAD`
  )

  switch (commitExistsOutput.exitCode) {
    case 0:
      return true
    case 1:
      return false
    default:
      throw new Error(commitExistsOutput.stderr)
  }
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
