import * as commandLineTools from '../src/command-line-tools'
import * as diffTool from '../src/diff'
import {expect, test} from '@jest/globals'

test("commit doesn't exist", async () => {
  let hash = '7a118f3040c7cbe7373bc03783a3e65d5cd42cd5'
  await expect(commandLineTools.doesCommitExist(hash)).resolves.toEqual(false)
})

test('commit exists', async () => {
  let hash = '@'
  await expect(commandLineTools.doesCommitExist(hash)).resolves.toEqual(true)
})

test('diff between commits', async () => {
  let hashOne = '@~'
  let hashTwo = '@'
  await expect(
    diffTool.getDiffBetweenCommits(hashOne, hashTwo)
  ).resolves.not.toBeUndefined()
})
