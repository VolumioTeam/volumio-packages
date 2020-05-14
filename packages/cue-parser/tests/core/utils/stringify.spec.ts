import { Parsed } from '../../../src/core/Parsed'
import { stringify } from '../../../src/core/utils/stringify'
import { getNewCueSheet, TestCueText } from '../../fixtures'

describe('core/utils/stringify.stringify(cueSheet)', () => {
  test('encodes a cueSheet object', () => {
    const original = Parsed(getNewCueSheet(), TestCueText.split('\n'), true)
    const stringified = stringify(original)
    const another = Parsed(getNewCueSheet(), stringified.split('\n'), true)
    expect(original).toEqual(another)
  })
})
