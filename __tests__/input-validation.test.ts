import {expect, test} from '@jest/globals'
import {validateDiffAlgorithm, validateRef} from '../src/input-validation'

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
  let inputs = ['7a118f3040c7cbe7373bc03783a3e65d5cd42cd5', '@', 'asdf', '']
  for (const input of inputs) {
    expect(() => {
      validateDiffAlgorithm(input)
    }).toThrow()
  }

  inputs = ['default', 'myers', 'minimal', 'patience', 'histogram']
  for (const input of inputs) {
    expect(validateDiffAlgorithm(input)).toEqual(input)
  }
})
