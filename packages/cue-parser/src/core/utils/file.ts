export const VALID_FILE_TYPES = [
  'BINARY',
  'MOTOROLA',
  'AIFF',
  'WAVE',
  'MP3',
] as const

export const isValidFileType = (type: string): type is FileType =>
  VALID_FILE_TYPES.includes(type as FileType)

export type FileType = typeof VALID_FILE_TYPES[number]
