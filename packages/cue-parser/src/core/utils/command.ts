export const VALID_CUE_COMMANDS = [
  'CATALOG',
  'CDTEXTFILE',
  'FILE',
  'FLAGS',
  'INDEX',
  'ISRC',
  'PERFORMER',
  'POSTGAP',
  'PREGAP',
  'REM',
  'SONGWRITER',
  'TITLE',
  'TRACK',
] as const

export const isValidCueCommand = (command: string): command is CueCommand =>
  VALID_CUE_COMMANDS.includes(command as CueCommand)

export type CueCommand = typeof VALID_CUE_COMMANDS[number]
