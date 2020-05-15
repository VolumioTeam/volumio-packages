import { CueSheetTime } from './time'

export const isValidIndexNumber = (n: number) =>
  !isNaN(n) && Number.isInteger(n) && n >= 0 && n <= 99

export interface CueSheetTrackIndex {
  number: number
  time: CueSheetTime
}
