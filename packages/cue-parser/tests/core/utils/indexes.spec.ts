import { isValidIndexNumber } from '../../../src/core/utils/indexes'

describe('core/utils/indexes.isValidIndexNumber(n)', () => {
  test('returns true if n is an integer between 0 and 99 included', () => {
    const random = Math.round(Math.random() * 99)
    expect(isValidIndexNumber(random)).toBe(true)
  })
  test('returns false if n < 0', () => {
    expect(isValidIndexNumber(-1)).toBe(false)
  })
  test('returns false if n > 99', () => {
    expect(isValidIndexNumber(100)).toBe(false)
  })
  test('returns false if n is NaN', () => {
    const n = parseInt('hello', 10)
    expect(isValidIndexNumber(n)).toBe(false)
  })
  test('returns false if n is float', () => {
    expect(isValidIndexNumber(10 / 7)).toBe(false)
  })
})
