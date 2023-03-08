<p align="center">
  <a href="https://github.com/ILikePlayingGames/line-diff-action"><img alt="line-diff-action status" src="https://github.com/ILikePlayingGames/line-diff-action/workflows/build-test/badge.svg"></a>
</p>

# Line Diff V1

---

This action gets the line by line differences between a given commit hash and HEAD.
This action is designed to format output for Discord so results may look weird in other applications.
Support for changing the Delta theme will come later.

# Usage

---

The [Checkout action](https://github.com/actions/checkout) checks out just the commit at HEAD by default.
Make sure `fetch-depth` is set to the number of commits between the commit hash you want to diff and HEAD
so both commits are fetched. Please see the checkout action repository linked above for more details about the use
of the `fetch-depth` parameter.

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
  # Use ${{ steps.get_diff.outputs.diff }}
  # to use the formatted diff in your next step
- run: echo ${{ steps.get_diff.outputs.diff }}
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
    # Use ${{ steps.get_diff.outputs.diff }}
    # to use the formatted diff in your next step
  - run: echo ${{ steps.get_diff.outputs.diff }}
```

## Diff Two Arbitrary Commits

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
    second-commit-hash: 'a757538ac02bdb031ad72c00f7966bffa1f4349b'
  # Use ${{ steps.get_diff.outputs.diff }}
  # to use the formatted diff in your next step
- run: echo ${{ steps.get_diff.outputs.diff }}
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
  # Use ${{ steps.get_diff.outputs.diff }}
  # to use the formatted diff in your next step
- run: echo ${{ steps.get_diff.outputs.diff }}
```

# Credits

---

This action uses [Delta](https://github.com/dandavison/delta) to generate the formatted diffs. Thank you, @hrueger,
for sharing the [piped command workaround](https://github.com/actions/toolkit/issues/359#issuecomment-603065463)!