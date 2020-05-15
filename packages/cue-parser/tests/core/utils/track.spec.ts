import { CueSheet } from '../../../src'
import {
  getGreatestTrackNumberInSheet,
  isValidTrackFlag,
  isValidTrackNumber,
  isValidTrackType,
  VALID_TRACK_FLAGS,
  VALID_TRACK_TYPES,
} from '../../../src/core/utils/track'

describe('core/utils/track', () => {
  describe('getGreatestTrackNumberInSheet(cueSheet)', () => {
    test('returns 0 if cueSheet has no tracks', () => {
      const cueSheet: CueSheet = {
        catalog: null,
        cdTextFile: null,
        files: [],
        performer: null,
        rem: [],
        songWriter: null,
        title: null,
      }
      expect(getGreatestTrackNumberInSheet(cueSheet)).toBe(0)
    })
    test('returns the greatest track number', () => {
      const cueSheet: CueSheet = {
        catalog: null,
        cdTextFile: null,
        files: [
          {
            name: 'one',
            tracks: [
              {
                flags: [],
                indexes: [],
                isrc: null,
                number: 1,
                offset: null,
                offsetSeconds: null,
                performer: null,
                postgap: null,
                pregap: null,
                songWriter: null,
                title: null,
                type: 'AUDIO',
              },
              {
                flags: [],
                indexes: [],
                isrc: null,
                number: 2,
                offset: null,
                offsetSeconds: null,
                performer: null,
                postgap: null,
                pregap: null,
                songWriter: null,
                title: null,
                type: 'AUDIO',
              },
            ],
            type: 'MP3',
          },
          {
            name: 'two',
            tracks: [
              {
                flags: [],
                indexes: [],
                isrc: null,
                number: 3,
                offset: null,
                offsetSeconds: null,
                performer: null,
                postgap: null,
                pregap: null,
                songWriter: null,
                title: null,
                type: 'AUDIO',
              },
            ],
            type: 'MP3',
          },
        ],
        performer: null,
        rem: [],
        songWriter: null,
        title: null,
      }
      expect(getGreatestTrackNumberInSheet(cueSheet)).toBe(3)
    })
  })
  describe('isValidTrackFlag(flag)', () => {
    test(`returns true if flag is one among ${VALID_TRACK_FLAGS.join(
      ', ',
    )}`, () => {
      VALID_TRACK_FLAGS.forEach((flag) =>
        expect(isValidTrackFlag(flag)).toBe(true),
      )
    })
    test(`returns false if flag is NOT one among ${VALID_TRACK_FLAGS.join(
      ', ',
    )}`, () => {
      expect(isValidTrackFlag('hello')).toBe(false)
    })
  })
  describe('isValidTrackNumber(n)', () => {
    test('returns true if n is an integer between 0 and 99 included', () => {
      const random = Math.round(Math.random() * 99)
      expect(isValidTrackNumber(random)).toBe(true)
    })
    test('returns false if n < 0', () => {
      expect(isValidTrackNumber(-1)).toBe(false)
    })
    test('returns false if n > 99', () => {
      expect(isValidTrackNumber(100)).toBe(false)
    })
    test('returns false if n is NaN', () => {
      const n = parseInt('hello', 10)
      expect(isValidTrackNumber(n)).toBe(false)
    })
    test('returns false if n is float', () => {
      expect(isValidTrackNumber(10 / 7)).toBe(false)
    })
  })
  describe('isValidTrackType(type)', () => {
    test(`returns true if type is one among ${VALID_TRACK_TYPES.join(
      ', ',
    )}`, () => {
      VALID_TRACK_TYPES.forEach((type) =>
        expect(isValidTrackType(type)).toBe(true),
      )
    })
    test(`returns false if type is NOT one among ${VALID_TRACK_TYPES.join(
      ', ',
    )}`, () => {
      expect(isValidTrackType('hello')).toBe(false)
    })
  })
})
