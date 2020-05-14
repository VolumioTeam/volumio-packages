import { isValidMediaCatalogNumber } from '../../../src/core/utils/mediaCatalogNumber'

describe('core/utils/mediaCatalogNumber.isValidMediaCatalogNumber(mcn)', () => {
  test('returns true if mcn is valid', () => {
    expect(isValidMediaCatalogNumber('1234567890123')).toBe(true)
  })
  test('returns false if mcn is not valid', () => {
    expect(isValidMediaCatalogNumber('hello123')).toBe(false)
  })
})
