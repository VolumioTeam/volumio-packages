import { Line, parseLine } from '../../../src/core/utils/parseLine'

describe('core/utils/parseLine.parseLine(line)', () => {
  test('returns null if line does not match a command format', () => {
    expect(parseLine('')).toBe(null)
    expect(parseLine('hello123')).toBe(null)
  })

  describe('returned Line', () => {
    test('Line.command is uppercase', () => {
      const line = parseLine('abc param') as Line
      expect(line.command).toBe('ABC')
    })
    test('Line.params are correctly extracted', () => {
      expect((parseLine('COMMAND one') as Line).params[0]).toBe('one')
      expect((parseLine('COMMAND       one') as Line).params[0]).toBe('one')
      expect((parseLine('COMMAND   one     two   ') as Line).params[1]).toBe(
        'two',
      )
      expect(
        (parseLine('COMMAND   "  one with space inside"     two   ') as Line)
          .params[0],
      ).toBe('  one with space inside')
      expect(
        (parseLine('COMMAND   "one with space inside"     two   ') as Line)
          .params[1],
      ).toBe('two')
      expect(
        (parseLine('COMMAND   ""one two      another   ') as Line).params[0],
      ).toBe('one')
      expect(
        (parseLine('COMMAND   "param with space inside     another   ') as Line)
          .params[0],
      ).toBe('param')
    })
  })
})
