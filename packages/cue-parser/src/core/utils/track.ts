import { CueSheet } from '../Parsed'

export const getGreatestTrackNumberInSheet = (cueSheet: CueSheet): number => {
  let greatest = 0

  cueSheet.files.forEach((file) => {
    file.tracks.forEach((track) => {
      track.number > greatest && (greatest = track.number)
    })
  })

  return greatest
}

export const isValidTrackNumber = (n: number) =>
  !isNaN(n) && Number.isInteger(n) && n >= 1 && n <= 99

export const VALID_TRACK_TYPES = [
  'AUDIO',
  'CDG',
  'MODE1/2048',
  'MODE1/2352',
  'MODE2/2048',
  'MODE2/2324',
  'MODE2/2336',
  'MODE2/2352',
  'CDI/2336',
  'CDI/2352',
] as const

export const isValidTrackType = (type: string): type is TrackType =>
  VALID_TRACK_TYPES.includes(type as TrackType)

export const VALID_TRACK_FLAGS = ['DCP', '4CH', 'PRE', 'SCMS'] as const

export const isValidTrackFlag = (flag: string): flag is TrackFlag =>
  VALID_TRACK_FLAGS.includes(flag as TrackFlag)

export type TrackType = typeof VALID_TRACK_TYPES[number]

export type TrackFlag = typeof VALID_TRACK_FLAGS[number]
