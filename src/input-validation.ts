import {doesCommitExist} from './command-line-tools'

export function validateDiffAlgorithm(input: string): string {
  const diffAlgorithmPattern = /^default|myers|minimal|patience|histogram$/

  if (diffAlgorithmPattern.test(input)) {
    return input
  } else {
    throw new Error(
      `'${input}' isn't a valid diff algorithm, see 
      https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-algorithmpatienceminimalhistogrammyers for options`
    )
  }
}

export function validateRef(fieldName: string, input: string): string {
  const refAllowedCharacterPattern = /^[@~^/\-a-z\d]+$/

  if (refAllowedCharacterPattern.test(input)) {
    if (!doesCommitExist(input)) {
      throw new Error(`Commit ${input} wasn't found for field ${fieldName}.`)
    } else {
      return input
    }
  } else {
    throw new Error(
      `'${input}' is not a valid git revision for \`${fieldName}\`.`
    )
  }
}

export function parseInt(
  fieldName: string,
  fieldIsRequired: boolean,
  input: string
): number | undefined {
  const parsedNumber = Number.parseInt(input)

  if (!isNaN(parsedNumber)) {
    // Actions input is '' if not defined
    if (input === '') {
      return undefined
    } else {
      return parsedNumber
    }
  } else {
    // Actions inputs are '' if not provided
    if (input === '' && !fieldIsRequired) {
      return undefined
    } else {
      throw new Error(`${input} isn't a valid integer for \`${fieldName}\`.`)
    }
  }
}
