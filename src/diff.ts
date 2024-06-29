import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { toPlatformPath } from '@actions/core';
import * as fs from 'fs';

export async function writeDiffToFile(
  hashOne: string,
  hashTwo: string,
  diffAlgorithm: string,
  filePath: string,
): Promise<void> {
  let args = `'${hashOne}' '${hashTwo}'`;

  if (diffAlgorithm !== 'default') {
    args = `${args} --diff-algorithm=${diffAlgorithm}`;
  }
  core.debug(`Diff arguments: '${args}'`);

  const platformPath = toPlatformPath(filePath);
  core.info(`Writing diff to ${platformPath}`);
  if (process.platform === 'win32') {
    const output = await exec.getExecOutput(
      /*
        Workaround for @actions/exec not supporting pipes
        Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
        */
      `powershell -Command git diff ${args} | delta | tee -FilePath '${platformPath}'`,
    );

    if (output.stderr !== '') {
      return Promise.reject(output.stderr);
    } else {
      core.info('Diff written successfully');
    }
  } else {
    const output = await exec.getExecOutput(
      /*
        Workaround for @actions/exec not supporting pipes
        Source: https://github.com/actions/toolkit/issues/359#issuecomment-603065463
         */
      `/bin/bash -c "git diff ${args} | delta | tee ${platformPath}"`,
    );

    if (output.stderr !== '') {
      return Promise.reject(output.stderr);
    } else {
      core.info('Diff written successfully');
    }
  }

  try {
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    fs.writeFileSync(filePath, data.trim());
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}
