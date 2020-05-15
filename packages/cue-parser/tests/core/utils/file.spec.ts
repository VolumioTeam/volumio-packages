import { isValidFileType, VALID_FILE_TYPES } from '../../../src/core/utils/file'

describe('core/utils/file.isValidFileType(type)', () => {
  test(`returns true if type is one among [${VALID_FILE_TYPES.join(
    ', ',
  )}]`, () => {
    VALID_FILE_TYPES.forEach((type) => expect(isValidFileType(type)).toBe(true))
  })
  test(`returns true if type is unknown`, () => {
    expect(isValidFileType('AGDSHK')).toBe(false)
  })
})
