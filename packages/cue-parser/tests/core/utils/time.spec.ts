import {
  CueSheetTime,
  diffTime,
  isValidTime,
  timeFromFrames,
  timeFromString,
  timeToFrames,
  timeToSeconds,
} from '../../../src/core/utils/time'

describe('core/utils/time', () => {
  test('diffTime(timeA, timeB) works', () => {
    expect(
      diffTime({ min: 5, sec: 10, frame: 30 }, { min: 2, sec: 0, frame: 50 }),
    ).toEqual({ min: 3, sec: 9, frame: 55 })
  })
  test('diffTime(timeA, timeB) works whatever the order of parameters is', () => {
    expect(
      diffTime({ min: 2, sec: 0, frame: 50 }, { min: 5, sec: 10, frame: 30 }),
    ).toEqual({ min: 3, sec: 9, frame: 55 })
  })
  test('isValidTime(time) works', () => {
    expect(isValidTime({ frame: 100, min: 200, sec: 8 })).toBe(false)
    expect(isValidTime({ frame: 100, min: 10, sec: 80 })).toBe(false)
    expect(isValidTime({ frame: 10, min: 99, sec: 8.3 })).toBe(false)
    expect(isValidTime({ frame: 10, min: 99, sec: 8 })).toBe(true)
  })
  test('timeFromFrames(frames) works', () => {
    expect(timeFromFrames(10)).toEqual<CueSheetTime>({
      frame: 10,
      min: 0,
      sec: 0,
    })
    expect(timeFromFrames(90)).toEqual<CueSheetTime>({
      frame: 15,
      min: 0,
      sec: 1,
    })
    expect(timeFromFrames(4590)).toEqual<CueSheetTime>({
      frame: 15,
      min: 1,
      sec: 1,
    })
  })
  test('timeFromString(timeString) works', () => {
    expect(timeFromString('12:14:61')).toEqual<CueSheetTime>({
      frame: 61,
      min: 12,
      sec: 14,
    })
  })
  test('timeFromString(timeString) returns null for an invalid time representation', () => {
    expect(timeFromString('hello')).toBe(null)
    expect(timeFromString('12:12:90')).toBe(null)
  })
  test('timeToFrames(time) works', () => {
    expect(
      timeToFrames({
        min: 5,
        sec: 12,
        frame: 10,
      }),
    ).toBe(23410)
  })
  test('timeToSeconds(time) works', () => {
    expect(
      timeToSeconds({
        min: 10,
        sec: 2,
        frame: 0,
      }),
    ).toBe(602)
    expect(
      timeToSeconds({
        min: 10,
        sec: 2,
        frame: 12,
      }),
    ).toBe(602.16)
  })
})
