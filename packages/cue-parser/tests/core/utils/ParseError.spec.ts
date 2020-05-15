import { ParseError } from '../../../src/core/utils/ParseError'

describe('core/utils/ParseError(line, message)', () => {
  test('returns a ParseError type', () => {
    expect(ParseError(12, 'hello')).toEqual<ParseError>({
      line: 12,
      message: 'hello',
      type: 'PARSE_ERROR',
    })
  })
})
