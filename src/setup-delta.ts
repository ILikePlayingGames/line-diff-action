import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import {execCommands, makeFileExecutable} from './command-line-tools'

const deltaVersion = '0.15.1'

async function downloadDelta(): Promise<string> {
  let deltaPath
  let deltaExtractedFolder
  let executableName

  if (process.platform === 'win32') {
    deltaPath = await tc.downloadTool(
      `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-x86_64-pc-windows-msvc.zip`
    )
    deltaExtractedFolder = await tc.extractZip(deltaPath)
    executableName = 'delta.exe'
  } else if (process.platform === 'darwin') {
    deltaPath = await tc.downloadTool(
      `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-x86_64-apple-darwin.tar.gz`
    )
    deltaExtractedFolder = await tc.extractTar(deltaPath)
    executableName = 'delta'
  } else {
    deltaPath = await tc.downloadTool(
      `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-x86_64-unknown-linux-gnu.tar.gz`
    )
    deltaExtractedFolder = await tc.extractTar(deltaPath)
    executableName = 'delta'
  }

  if (process.platform !== 'win32') {
    await makeFileExecutable(`${deltaExtractedFolder}/${executableName}`)
  }

  core.info(`Downloaded Delta ${deltaVersion} for ${process.platform}`)

  const cachedPath = await tc.cacheFile(
    deltaExtractedFolder,
    executableName,
    'delta',
    deltaVersion
  )

  core.debug(`cached path: ${cachedPath}`)

  return cachedPath
}

async function setupDelta(): Promise<void> {
  await execCommands([
    'git config --local core.pager "delta"',
    'git config --local interactive.diffFilter "delta --color-only"',
    'git config --local delta.features "false"',
    'git config --local merge.conflictStyle "diff3"',
    'git config --local diff.colorMoved "default"'
  ])
}

export async function loadDelta(): Promise<void> {
  let deltaDir = tc.find('delta', deltaVersion)

  if (deltaDir !== '') {
    core.debug(`delta found at ${deltaDir}`)
  } else {
    core.info(`delta ${deltaVersion} not found in cache, downloading...`)
    deltaDir = await downloadDelta()
  }

  core.addPath(deltaDir)
  await setupDelta()
}
