import {doesCommitExist} from './command-line-tools'

export function validateDiffAlgorithm(input: string): string {
  const diffAlgorithmPattern = /^default|myers|minimal|patience|histogram$/

  if (input === '' || diffAlgorithmPattern.test(input)) {
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

export function validateColumnWidth(input: string): number {
  const columnWidthInt = parseInt('column-width', true, input)

  if (columnWidthInt !== undefined) {
    if (columnWidthInt >= 1) {
      return columnWidthInt
    } else {
      throw new Error('Column width must be greater than or equal to 1.')
    }
  } else {
    throw new Error('`column-width` is undefined. Please create an issue.')
  }
}

export function validateRulerWidth(
  columnWidth: number,
  rulerWidthString: string
): number | undefined {
  const rulerWidth = parseInt('ruler-width', false, rulerWidthString)

  if (rulerWidth !== undefined) {
    if (rulerWidth >= 0 && rulerWidth <= columnWidth) {
      return rulerWidth
    } else {
      throw new Error(
        'Ruler width must be greater than or equal to zero and equal to or less then column width.'
      )
    }
  }
  // The ruler width is optional, so it's fine if it's missing
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
