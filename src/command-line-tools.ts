import * as exec from '@actions/exec'

export async function setupDiffSoFancy(): Promise<void> {
  // Setup git to use diff-so-fancy
  const setupGitOutput: exec.ExecOutput = await exec.getExecOutput(
    `git config --global core.pager "diff-so-fancy | less --tabs=4 -RFX"
    git config --global interactive.diffFilter "diff-so-fancy --patch"`
  )
  if (setupGitOutput.exitCode !== 0) {
    throw new Error(setupGitOutput.stderr)
  }

  // Setup colours
  const setColoursOutput: exec.ExecOutput = await exec.getExecOutput(
    `git config --global color.ui true

    git config --global color.diff-highlight.oldNormal    "red bold"
    git config --global color.diff-highlight.oldHighlight "red bold 52"
    git config --global color.diff-highlight.newNormal    "green bold"
    git config --global color.diff-highlight.newHighlight "green bold 22"
    
    git config --global color.diff.meta       "11"
    git config --global color.diff.frag       "magenta bold"
    git config --global color.diff.func       "146 bold"
    git config --global color.diff.commit     "yellow bold"
    git config --global color.diff.old        "red bold"
    git config --global color.diff.new        "green bold"
    git config --global color.diff.whitespace "red reverse"`
  )
  if (setColoursOutput.exitCode !== 0) {
    throw new Error(setColoursOutput.stderr)
  }
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
