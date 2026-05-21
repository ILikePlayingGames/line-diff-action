import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const presetConfig = createJsWithTsEsmPreset({})

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
}

export default jestConfig
