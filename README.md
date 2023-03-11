<p align="center">
  <a href="https://github.com/ILikePlayingGames/line-diff-action"><img alt="line-diff-action status" src="https://github.com/ILikePlayingGames/line-diff-action/workflows/build-test/badge.svg"></a>
</p>

# Line Diff V1

---

This action gets the line by line differences between two commits and formats the result using
[Delta](https://github.com/dandavison/delta). The result is then written to `./diff.txt` on the runner.
It cannot be passed as a step output or an environment variable due to the ANSI escape codes and other special
characters that may be present in the diff.

# Usage

---

The [Checkout action](https://github.com/actions/checkout) checks out just the commit at HEAD by default.
Make sure `fetch-depth` is set to the number of commits between the commit hash you want to diff and HEAD
so both commits are fetched. Please see the checkout action repository linked above for more details about the use
of the `fetch-depth` parameter.

## Options
| Parameter            | Required | Description                                                                                                                                                             |
|----------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commit-hash`        | true     | The commit hash to compare to HEAD, or `second-commit-hash` if provided                                                                                                 |
| `second-commit-hash` | false    | The commit hash to compare the first commit hash to, defaults to HEAD                                                                                                   |
| `diff-algorithm`     | false    | The git diff algorithm to use (see [man page](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-algorithmpatienceminimalhistogrammyers) for details   |
| `delta-theme`        | false    | The name of the theme that Delta will use to format the diff (see [the delta theme list](https://github.com/dandavison/delta/blob/master/themes.gitconfig) for options  |

## Diff Previous Commit and HEAD

```yaml
- uses: actions/checkout@v3
  with:
    # Fetch HEAD and the commit before it
    fetch-depth: 2
  # Get the formatted line-by-line diff
- id: get_diff
  uses: ILikePlayingGames/line-diff
  with:
    commit-hash: '@~'
  # Read ./diff.txt in your next step to use the diff.
- run: cat ./diff.txt
```

## Diff Specific Commit and HEAD

```yaml
  - uses: actions/checkout@v3
    with:
      # Make sure fetch depth is set to include
      # the commit hash below.
      fetch-depth: 0
  # Get the formatted line-by-line diff
  - id: get_diff
    uses: ILikePlayingGames/line-diff
    with:
      commit-hash: '7a118f3040c7cbe7373bc03783a3e65d5cd42cd4'
  # Read ./diff.txt in your next step to use the diff.
  - run: cat ./diff.txt
```

## Diff Two Arbitrary Commits

```yaml
- uses: actions/checkout@v3
  with:
    # Make sure fetch depth is set to include
    # the commit hashes below.
    fetch-depth: 0
# Get the formatted line-by-line diff
- id: get_diff
  uses: ILikePlayingGames/line-diff
  with:
    commit-hash: '7a118f3040c7cbe7373bc03783a3e65d5cd42cd4'
    second-commit-hash: 'a757538ac02bdb031ad72c00f7966bffa1f4349b'
  # Read ./diff.txt in your next step to use the diff.
- run: cat ./diff.txt
```

## Diff With Different Algorithm

```yaml
- uses: actions/checkout@v3
  with:
    # Make sure fetch depth is set to include
    # the commit hash below.
    fetch-depth: 0
# Get the formatted line-by-line diff
- id: get_diff
  uses: ILikePlayingGames/line-diff
  with:
    commit-hash: '7a118f3040c7cbe7373bc03783a3e65d5cd42cd4'
    # Please see git-diff documentation for options
    diff-algorithm: 'minimal'
  # Read ./diff.txt in your next step to use the diff.
- run: cat ./diff.txt
```

## Use a custom theme
```yaml
- uses: actions/checkout@v3
  with:
    # Fetch HEAD and the commit before it
    fetch-depth: 2
  # Get the formatted line-by-line diff
- id: get_diff
  uses: ILikePlayingGames/line-diff
  with:
    commit-hash: '@~'
    # Use the discord-dark custom theme
    delta-theme: discord-dark
  # Read ./diff.txt in your next step to use the diff.
- run: cat ./diff.txt
```

# Credits

---

This action uses [Delta](https://github.com/dandavison/delta) to generate the formatted diffs. Thank you, @hrueger,
for sharing the [piped command workaround](https://github.com/actions/toolkit/issues/359#issuecomment-603065463)!