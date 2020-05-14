import { isValidISRCCode } from '../../../src/core/utils/isrcCode'

describe('core/utils/isrcCode.isValidISRCCode(code)', () => {
  test('returns true if code is valid', () => {
    expect(isValidISRCCode('ABCDE1234567')).toBe(true)
  })
  test('returns false if code is not valid', () => {
    expect(isValidISRCCode('hello')).toBe(false)
  })
})
