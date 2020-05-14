const FRAMES_IN_SECOND = 75
const FRAMES_IN_MINUTE = FRAMES_IN_SECOND * 60

const TIME_STRING_REGEX = /^(\d{2}):(\d{2}):(\d{2})$/

export const timeFromString = (timeString: string): CueSheetTime | null => {
  const match = timeString.match(TIME_STRING_REGEX)

  // eslint-disable-next-line prettier/prettier
  if (match === null) { return null }

  const time: CueSheetTime = {
    min: parseInt(match[1], 10),
    sec: parseInt(match[2], 10),
    frame: parseInt(match[3], 10),
  }

  return isValidTime(time) ? time : null
}

export const timeFromFrames = (frames: number): CueSheetTime => {
  const min = Math.floor(frames / FRAMES_IN_MINUTE)
  const remainigAfterMinutes = frames % FRAMES_IN_MINUTE
  const sec = Math.floor(remainigAfterMinutes / FRAMES_IN_SECOND)

  return {
    frame: remainigAfterMinutes % FRAMES_IN_SECOND,
    min,
    sec,
  }
}

export const isValidTime = (time: CueSheetTime): boolean =>
  Number.isInteger(time.frame) &&
  Number.isInteger(time.min) &&
  Number.isInteger(time.sec) &&
  time.frame >= 0 &&
  time.frame <= 74 &&
  time.min >= 0 &&
  time.min <= 99 &&
  time.sec >= 0 &&
  time.sec <= 59

export const timeToSeconds = (time: CueSheetTime): number =>
  time.min * 60 + time.sec + time.frame * (1 / 75)

export const timeToFrames = (time: CueSheetTime): number =>
  time.frame + time.sec * FRAMES_IN_SECOND + time.min * FRAMES_IN_MINUTE

export const diffTime = (
  timeA: CueSheetTime,
  timeB: CueSheetTime,
): CueSheetTime =>
  timeFromFrames(Math.abs(timeToFrames(timeA) - timeToFrames(timeB)))

export interface CueSheetTime {
  min: number
  sec: number
  frame: number
}
