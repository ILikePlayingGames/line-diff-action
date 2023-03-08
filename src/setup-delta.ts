import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getExecOutput} from '@actions/exec'

const deltaVersion = '0.15.1'

/**
 * Download Delta for the OS of the Github-hosted runner (can be Windows x64, macOS x64, or Ubuntu x64)
 */
async function downloadDelta(): Promise<string> {
  let deltaPath
  let deltaExtractedFolder
  let deltaPlatform

  try {
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
  } catch (e) {
    core.error('Delta download failed')
    return Promise.reject(e)
  }

  core.info(`Downloaded Delta ${deltaVersion} for ${process.platform}`)

  deltaExtractedFolder = `${deltaExtractedFolder}/delta-${deltaVersion}-${deltaPlatform}`

  try {
    const cachedPath = await tc.cacheDir(
      deltaExtractedFolder,
      'delta',
      deltaVersion
    )

    core.debug(`cached path: ${cachedPath}`)

    return Promise.resolve(cachedPath)
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Include the themes in dist/themes.gitconfig in the runner's local Git config
 */
async function importThemes(): Promise<void> {
  const themesFileName = 'themes.gitconfig'
  const themesPath =
    process.env.RUNNER_OS === undefined
      ? `${__dirname}/../dist/${themesFileName}`
      : `${__dirname}/themes.gitconfig`
  const exitCode = await exec.exec(
    `git config --local --add include.path ${themesPath}`
  )

  return exitCode === 0
    ? Promise.resolve()
    : Promise.reject(
        new Error(
          `Failed to include ${__dirname}/themes.gitconfig in runner Git config`
        )
      )
}

/**
 * Configures Delta to use a given theme from the list of installed themes
 *
 * @param themeName name of the theme to use
 */
async function selectTheme(themeName: string): Promise<void> {
  const output = await getExecOutput(
    `git config --local delta.features "${themeName}"`
  )

  if (output.exitCode === 0) {
    core.info(`Selected Delta theme ${themeName}`)
    return Promise.resolve()
  } else {
    return Promise.reject(output.stderr)
  }
}

/**
 * Setup Delta with the custom theme for Discord
 */
export async function setupDelta(): Promise<void> {
  try {
    await selectTheme('discord')
    await importThemes()
    return Promise.resolve()
  } catch (e) {
    core.error('Delta setup failed')
    return Promise.reject(e)
  }
}

export async function loadDelta(): Promise<void> {
  try {
    let deltaDir = tc.find('delta', deltaVersion)

    if (deltaDir !== '') {
      core.info(`delta found at ${deltaDir}`)
    } else {
      core.info(`delta ${deltaVersion} not found in cache, downloading...`)
      deltaDir = await downloadDelta()
    }

    core.addPath(deltaDir)
    await setupDelta()
    return Promise.resolve()
  } catch (e) {
    return Promise.reject(e)
  }
}
