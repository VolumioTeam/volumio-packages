import { isLeft, isRight } from 'fp-ts/lib/Either'

import { parse, ParseError } from '../../src/core'
import { BadCueText, LiveInBerlinCueText } from '../fixtures'

describe('Core Module', () => {
  test('exports a "parse" function', () => {
    expect(typeof parse).toBe('function')
  })
  test('exports a "ParseError" function', () => {
    expect(typeof ParseError).toBe('function')
  })
})

describe('core.parse(text, ignoreErrors?: boolean', () => {
  test('returns Left<ParseError> if text is not valid and ignoreErrors = undefined | false', () => {
    if (isRight(parse(BadCueText, undefined))) {
      throw new Error('result is Right')
    }
    if (isRight(parse(BadCueText, false))) {
      throw new Error('result is Right')
    }
  })
  test('returns Right<CueSheet> if text is valid and ignoreErrors = undefined | false', () => {
    const r1 = parse(LiveInBerlinCueText, undefined)
    if (isLeft(r1)) {
      throw new Error(`result is Left<${JSON.stringify(r1.left)}>`)
    }

    const r2 = parse(LiveInBerlinCueText, undefined)
    if (isLeft(r2)) {
      throw new Error(`result is Left<${JSON.stringify(r2.left)}>`)
    }
  })
  test('always returns a CueSheet if ignoreErrors = true', () => {
    const r1 = parse(BadCueText, true)
    expect(Array.isArray(r1.files)).toBe(true)
    const r2 = parse(LiveInBerlinCueText, true)
    expect(Array.isArray(r2.files)).toBe(true)
  })
})
