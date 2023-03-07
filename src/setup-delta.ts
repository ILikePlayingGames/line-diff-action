import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import {execCommands} from './command-line-tools'

const deltaVersion = '0.15.1'

/**
 * Download Delta for the OS of the Github-hosted runner (can be Windows x64, macOS x64, or Ubuntu x64)
 */
async function downloadDelta(): Promise<string> {
  let deltaPath
  let deltaExtractedFolder
  let deltaPlatform

  if (process.platform === 'win32') {
    deltaPlatform = 'x86_64-pc-windows-msvc'
    deltaPath = await tc.downloadTool(
      `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-${deltaPlatform}.zip`
    )
    deltaExtractedFolder = await tc.extractZip(deltaPath)
  } else if (process.platform === 'darwin') {
    deltaPlatform = 'x86_64-apple-darwin'
    deltaPath = await tc.downloadTool(
      `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-${deltaPlatform}.tar.gz`
    )
    deltaExtractedFolder = await tc.extractTar(deltaPath)
  } else {
    deltaPlatform = 'x86_64-unknown-linux-gnu'
    deltaPath = await tc.downloadTool(
      `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-${deltaPlatform}.tar.gz`
    )
    deltaExtractedFolder = await tc.extractTar(deltaPath)
  }

  core.info(`Downloaded Delta ${deltaVersion} for ${process.platform}`)

  deltaExtractedFolder = `${deltaExtractedFolder}/delta-${deltaVersion}-${deltaPlatform}`

  const cachedPath = await tc.cacheDir(
    deltaExtractedFolder,
    'delta',
    deltaVersion
  )

  core.debug(`cached path: ${cachedPath}`)

  return cachedPath
}

/**
 * Setup Delta with the custom theme for Discord
 */
export async function setupDelta(): Promise<void> {
  // On the runner, index.js and themes.gitconfig are in the same folder.
  const themesPath =
    process.env.RUNNER_OS === undefined
      ? '../dist/themes.gitconfig'
      : 'themes.gitconfig'

  await execCommands([
    `git config --local include.path "${themesPath}"`,
    'git config --local delta.features "discord"'
  ])
}

export async function loadDelta(): Promise<void> {
  let deltaDir = tc.find('delta', deltaVersion)

  if (deltaDir !== '') {
    core.info(`delta found at ${deltaDir}`)
  } else {
    core.info(`delta ${deltaVersion} not found in cache, downloading...`)
    deltaDir = await downloadDelta()
  }

  core.addPath(deltaDir)
  await setupDelta()
}
