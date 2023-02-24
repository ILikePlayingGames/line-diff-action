import * as commandLineTools from '../src/command-line-tools'
import * as diffTool from '../src/diff'
import {expect, test} from '@jest/globals'
import {
  validateColumnWidth,
  validateDiffAlgorithm,
  validateRef,
  validateRulerWidth
} from '../src/input-validation'

test('validate hash', () => {
  // invalid
  let inputs = ['', '$^&^&!']
  for (const input of inputs) {
    expect(() => {
      validateRef('commit-hash', input)
    }).toThrow()
  }

  // valid
  inputs = ['7a118f3040c7cbe7373bc03783a3e65d5cd42cd5', '@', '@~1']
  for (const input of inputs) {
    expect(validateRef('commit-hash', input)).toEqual(input)
  }
})

test('validate diff algorithm', () => {
  // invalid
  let inputs = ['7a118f3040c7cbe7373bc03783a3e65d5cd42cd5', '@', 'asdf']
  for (const input of inputs) {
    expect(() => {
      validateDiffAlgorithm(input)
    }).toThrow()
  }

  inputs = ['', 'default', 'myers', 'minimal', 'patience', 'histogram']
  for (const input of inputs) {
    expect(validateDiffAlgorithm(input)).toEqual(input)
  }
})

test('validate column width', () => {
  expect(() => {
    validateColumnWidth('-1')
  }).toThrow()
  expect(() => {
    validateColumnWidth('0')
  }).toThrow()
  expect(validateColumnWidth('1')).toEqual(1)
})

test('validate ruler width', () => {
  // valid
  let columnWidths: number[] = [80, 80, 80]
  let rulerWidths = ['50', '0', '80']

  for (let i = 0; i < 3; i++) {
    expect(validateRulerWidth(columnWidths[i], rulerWidths[i])).toEqual(
      Number.parseInt(rulerWidths[i])
    )
  }

  expect(validateRulerWidth(80, '')).toEqual(undefined)

  // invalid
  let invalidColumnWidths = [1, 6, 2]
  rulerWidths = ['2', '-8', '5']

  for (let i = 0; i < 3; i++) {
    expect(() => {
      validateRulerWidth(invalidColumnWidths[i], rulerWidths[i])
    }).toThrow()
  }
})

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
    diffTool.getDiffBetweenCommits(hashOne, hashTwo, '', 80, undefined)
  ).resolves.not.toBeUndefined()
})
