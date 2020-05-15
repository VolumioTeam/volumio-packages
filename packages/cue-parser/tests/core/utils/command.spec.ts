import {
  isValidCueCommand,
  VALID_CUE_COMMANDS,
} from '../../../src/core/utils/command'

describe('core/utils/command.isValidCueCommand(command)', () => {
  test(`returns true if command is one among [${VALID_CUE_COMMANDS.join(
    ', ',
  )}]`, () => {
    VALID_CUE_COMMANDS.forEach((command) =>
      expect(isValidCueCommand(command)).toBe(true),
    )
  })
  test(`returns true if command is unknown`, () => {
    expect(isValidCueCommand('AGDSHK')).toBe(false)
  })
})
