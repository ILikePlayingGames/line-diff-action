import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { getExecOutput } from '@actions/exec'

const deltaVersion = '0.19.2'

/**
 * Download Delta for the OS of the Github-hosted runner (can be Windows x64, macOS x64/arm64, or Ubuntu x64/arm64)
 */
async function downloadDelta(): Promise<string> {
  let deltaArchiveExtension: '.zip' | '.tar.gz' | undefined
  let deltaPlatform

  if (process.arch === 'x64') {
    if (process.platform === 'win32') {
      deltaPlatform = 'x86_64-pc-windows-msvc'
      deltaArchiveExtension = '.zip'
    }
    else if (process.platform === 'darwin') {
      deltaPlatform = 'x86_64-apple-darwin'
      deltaArchiveExtension = '.tar.gz'
    }
    else if (process.platform === 'linux') {
      deltaPlatform = 'x86_64-unknown-linux-gnu'
      deltaArchiveExtension = '.tar.gz'
    }
  }
  else if (process.arch === 'arm64') {
    if (process.platform === 'darwin') {
      deltaPlatform = 'aarch64-apple-darwin'
      deltaArchiveExtension = '.tar.gz'
    }
    else if (process.platform === 'linux') {
      deltaPlatform = 'aarch64-unknown-linux-gnu'
      deltaArchiveExtension = '.tar.gz'
    }
  }

  if (deltaPlatform === undefined || deltaArchiveExtension === undefined) {
    throw new Error(`Unsupported runner platform: ${process.arch}-${process.platform}`)
  }

  const deltaPath = await tc.downloadTool(
    `https://github.com/dandavison/delta/releases/download/${deltaVersion}/delta-${deltaVersion}-${deltaPlatform}${deltaArchiveExtension}`,
  )
  let deltaExtractedFolder: string

  if (deltaArchiveExtension === '.zip') {
    deltaExtractedFolder = await tc.extractZip(deltaPath)
  }
  else {
    deltaExtractedFolder = await tc.extractTar(deltaPath)
  }

  core.info(`Downloaded Delta ${deltaVersion} for ${process.platform}`)

  deltaExtractedFolder = `${deltaExtractedFolder}/delta-${deltaVersion}-${deltaPlatform}`

  await tc.downloadTool(
    `https://raw.githubusercontent.com/dandavison/delta/refs/tags/${deltaVersion}/themes.gitconfig`,
    `${deltaExtractedFolder}/themes.gitconfig`,
  )

  core.info(`Downloaded Delta custom themes`)

  try {
    const cachedPath = await tc.cacheDir(
      deltaExtractedFolder,
      'delta',
      deltaVersion,
    )

    core.debug(`cached path: ${cachedPath}`)

    return Promise.resolve(cachedPath)
  }
  catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Include the themes in the runner's local Git config
 */
async function importThemes(): Promise<void> {
  const themesPath = `${tc.find('delta', deltaVersion)}/themes.gitconfig`

  /*
 Will create a duplicate if the key already exists but that doesn't impact
 functionality
 */
  const exitCode = await exec.exec(
    `git config --local --add include.path ${themesPath}`,
  )

  return exitCode === 0
    ? Promise.resolve()
    : Promise.reject(
        new Error(
          `Failed to include ${themesPath}/themes.gitconfig in runner Git config`,
        ),
      )
}

/**
 * Configures Delta to use a given theme from the list of installed themes
 *
 * @param themeName name of the theme to use
 */
async function selectTheme(themeName: string): Promise<void> {
  const output = await getExecOutput(
    `git config --local delta.features "${themeName}"`,
  )

  if (output.exitCode === 0) {
    core.info(`Selected Delta theme ${themeName}`)
    return Promise.resolve()
  }
  else {
    return Promise.reject(output.stderr)
  }
}

/**
 * Setup Delta with a custom theme, if provided
 */
export async function setupDelta(deltaTheme: string): Promise<void> {
  if (deltaTheme !== '') {
    try {
      await importThemes()
      await selectTheme(deltaTheme)
      return Promise.resolve()
    }
    catch (e) {
      core.error('Delta setup failed')
      return Promise.reject(e)
    }
  }
}

export async function loadDelta(deltaTheme: string): Promise<void> {
  try {
    let deltaDir = tc.find('delta', deltaVersion)

    if (deltaDir !== '') {
      core.info(`delta found at ${deltaDir}`)
    }
    else {
      core.info(`delta ${deltaVersion} not found in cache, downloading...`)
      deltaDir = await downloadDelta()
    }

    core.addPath(deltaDir)
    await setupDelta(deltaTheme)
    return Promise.resolve()
  }
  catch (e) {
    return Promise.reject(e)
  }
}
