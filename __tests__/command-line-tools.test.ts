import * as commandLineTools from '../src/command-line-tools';
import { setupDelta } from '../src/setup-delta';
import * as diffTool from '../src/diff';
import { expect, test } from '@jest/globals';

test("commit doesn't exist", async () => {
  const hash = '7a118f3040c7cbe7373bc03783a3e65d5cd42cd5';
  await expect(commandLineTools.doesCommitExist(hash)).resolves.toBe(false);
});

test('commit exists', async () => {
  const hash = '@';
  await expect(commandLineTools.doesCommitExist(hash)).resolves.toBe(true);
});

test('diff between commits', async () => {
  const hashOne = '@~2';
  const hashTwo = '@';

  await setupDelta('discord');
  const promise = diffTool.writeDiffToFile(
    hashOne,
    hashTwo,
    'default',
    './diff.txt',
  );

  await expect(promise).resolves.toBeUndefined();
});
