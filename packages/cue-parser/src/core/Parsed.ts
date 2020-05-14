import { Either, left, right } from 'fp-ts/lib/Either'

import { isValidCueCommand } from './utils/command'
import { FileType, isValidFileType, VALID_FILE_TYPES } from './utils/file'
import { CueSheetTrackIndex, isValidIndexNumber } from './utils/indexes'
import { isValidISRCCode } from './utils/isrcCode'
import { isValidMediaCatalogNumber } from './utils/mediaCatalogNumber'
import { ParseError } from './utils/ParseError'
import { parseLine } from './utils/parseLine'
import {
  isNoneProcessingContext,
  isTrackProcessingContext,
  ProcessingContext,
} from './utils/ProcessingContext'
import {
  CueSheetTime,
  diffTime,
  timeFromString,
  timeToSeconds,
} from './utils/time'
import {
  getGreatestTrackNumberInSheet,
  isValidTrackNumber,
  isValidTrackType,
  TrackFlag,
  TrackType,
  VALID_TRACK_TYPES,
} from './utils/track'

const VALID_FILE_TYPES_LIST = VALID_FILE_TYPES.join(', ')
const VALID_TRACK_TYPES_LIST = VALID_TRACK_TYPES.join(', ')

export type ParsedFunction = {
  (cueSheet: CueSheet, lines: string[], ignoreErrors: false): Either<
    ParseError,
    CueSheet
  >
  (cueSheet: CueSheet, lines: string[], ignoreErrors: true): CueSheet
}

export const Parsed: ParsedFunction = (
  cueSheet: CueSheet,
  lines: string[],
  ignoreErrors: boolean,
): any => {
  let processingContext = ProcessingContext('None') as ProcessingContext

  const totalLines = lines.length

  for (let idx = 0; idx < totalLines; idx++) {
    const parsedLine = parseLine(lines[idx])

    // eslint-disable-next-line prettier/prettier
    if (parsedLine === null) { continue }

    const { command: cmd, params } = parsedLine

    const lineNo = idx + 1
    const command = isValidCueCommand(cmd) ? cmd : undefined

    if (command === undefined) {
      // eslint-disable-next-line prettier/prettier
      if (ignoreErrors) { continue }
      return left(ParseError(lineNo, `"${cmd}" is not a valid CUE command`))
    }

    switch (command) {
      case 'CATALOG': {
        const [catalog] = params

        if (catalog === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'CATALOG command must have one parameter'),
            )
          }
        } else {
          if (isNoneProcessingContext(processingContext)) {
            if (
              cueSheet.cdTextFile !== null ||
              cueSheet.title !== null ||
              cueSheet.performer !== null ||
              cueSheet.songWriter !== null
            ) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    cueSheet.cdTextFile !== null
                      ? `CATALOG command must come before than CDTEXTFILE command`
                      : cueSheet.title !== null
                      ? `CATALOG command must come before than TITLE command`
                      : cueSheet.performer !== null
                      ? `CATALOG command must come before than PERFORMER command`
                      : `CATALOG command must come before than SONGWRITER command`,
                  ),
                )
              }
            } else {
              if (isValidMediaCatalogNumber(catalog)) {
                cueSheet.catalog = catalog
              } else {
                if (!ignoreErrors) {
                  return left(
                    ParseError(
                      lineNo,
                      `CATALOG command mcn must be a valid Media Catalog Number`,
                    ),
                  )
                }
              }
            }
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(lineNo, 'CATALOG must be a top level command'),
              )
            }
          }
        }

        break
      }
      case 'CDTEXTFILE': {
        const [cdTextFile] = params

        if (cdTextFile === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'CDTEXTFILE command must have one parameter'),
            )
          }
        } else {
          if (isNoneProcessingContext(processingContext)) {
            if (
              cueSheet.title !== null ||
              cueSheet.performer !== null ||
              cueSheet.songWriter !== null
            ) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    cueSheet.title !== null
                      ? `CDTEXTFILE command must come before than TITLE command`
                      : cueSheet.performer !== null
                      ? `CDTEXTFILE command must come before than PERFORMER command`
                      : `CDTEXTFILE command must come before than SONGWRITER command`,
                  ),
                )
              }
            } else {
              cueSheet.cdTextFile = cdTextFile
            }
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(lineNo, 'CDTEXTFILE must be a top level command'),
              )
            }
          }
        }

        break
      }
      case 'TITLE': {
        const [title] = params

        if (title === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'TITLE command must have one parameter'),
            )
          }
        } else {
          if (isNoneProcessingContext(processingContext)) {
            cueSheet.title = title
          } else if (isTrackProcessingContext(processingContext)) {
            if (processingContext.track.indexes.length > 0) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    `TITLE command must come before any INDEX command in "Track" context`,
                  ),
                )
              }
            } else {
              processingContext.track.title = title
            }
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(
                  lineNo,
                  'TITLE command must come in the "None" or in the "Track" context',
                ),
              )
            }
          }
        }

        break
      }

      case 'PERFORMER': {
        const [performer] = params

        if (performer === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'PERFORMER command must have one parameter'),
            )
          }
        } else {
          if (isNoneProcessingContext(processingContext)) {
            cueSheet.performer = performer
          } else if (isTrackProcessingContext(processingContext)) {
            if (processingContext.track.indexes.length > 0) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    `PERFORMER command must come before any INDEX command in "Track" context`,
                  ),
                )
              }
            } else {
              processingContext.track.performer = performer
            }
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(
                  lineNo,
                  'PERFORMER command must come in the "None" or in the "Track" context',
                ),
              )
            }
          }
        }

        break
      }
      case 'SONGWRITER': {
        const [songWriter] = params

        if (songWriter === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'SONGWRITER command must have one parameter'),
            )
          }
        } else {
          if (isNoneProcessingContext(processingContext)) {
            cueSheet.songWriter = songWriter
          } else if (isTrackProcessingContext(processingContext)) {
            if (processingContext.track.indexes.length > 0) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    `SONGWRITER command must come before any INDEX command in "Track" context`,
                  ),
                )
              }
            } else {
              processingContext.track.songWriter = songWriter
            }
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(
                  lineNo,
                  'SONGWRITER command must come in the "None" or in the "Track" context',
                ),
              )
            }
          }
        }

        break
      }
      case 'FILE': {
        const [name, type] = params

        processingContext = ProcessingContext('None')

        if (name === undefined || type === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'FILE command must have two parameters'),
            )
          }
        } else {
          if (isValidFileType(type)) {
            const file: CueSheetFile = {
              name,
              tracks: [],
              type,
            }

            cueSheet.files.push(file)
            processingContext = ProcessingContext('File', file)
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(
                  lineNo,
                  `FILE command file-type must be one of [${VALID_FILE_TYPES_LIST}]`,
                ),
              )
            }
          }
        }

        break
      }
      case 'TRACK': {
        const [numberStr, type] = params

        if (isNoneProcessingContext(processingContext)) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, 'TRACK command must come in a "File" context'),
            )
          }
        } else {
          processingContext = ProcessingContext('File', processingContext.file)

          if (numberStr === undefined || type === undefined) {
            if (!ignoreErrors) {
              return left(
                ParseError(lineNo, 'TRACK command must have two parameters'),
              )
            }
          } else {
            const number = parseInt(numberStr, 10)
            const badNumber = !isValidTrackNumber(number)
            const badType = !isValidTrackType(type)
            const greatestTrackNumberInSheet = getGreatestTrackNumberInSheet(
              cueSheet,
            )
            const badNumberSequence = number !== greatestTrackNumberInSheet + 1

            if (badNumber || badType || badNumberSequence) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    badNumber
                      ? 'TRACK command track-number must be a number between 1 and 99'
                      : badType
                      ? `TRACK command track-type must be one of [${VALID_TRACK_TYPES_LIST}]`
                      : `TRACK command track-number must be one greater than a previously parsed track-number`,
                  ),
                )
              }
            } else {
              const track: CueSheetTrack = {
                flags: [],
                indexes: [],
                isrc: null,
                number,
                offset: null,
                offsetSeconds: null,
                performer: null,
                postgap: null,
                pregap: null,
                songWriter: null,
                title: null,
                type: type as TrackType,
              }

              processingContext = ProcessingContext(
                'Track',
                processingContext.file,
                track,
              )
              processingContext.file.tracks.push(track)
            }
          }
        }

        break
      }
      case 'FLAGS': {
        break
      }
      case 'INDEX': {
        const [numberStr, timeStr] = params

        if (isTrackProcessingContext(processingContext)) {
          if (numberStr === undefined || timeStr === undefined) {
            if (!ignoreErrors) {
              return left(
                ParseError(lineNo, 'INDEX command must have two parameters'),
              )
            }
          } else {
            const number = parseInt(numberStr, 10)
            const time = timeFromString(timeStr)
            const badNumber = !isValidIndexNumber(number)

            if (badNumber || time === null) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    badNumber
                      ? 'INDEX command number must be a number between 00 and 99'
                      : time === null
                      ? 'INDEX command time must be in mm:ss:ff format'
                      : '',
                  ),
                )
              }
            } else {
              let takeIndex = true

              if (processingContext.track.postgap !== null) {
                takeIndex = false
                if (!ignoreErrors) {
                  return left(
                    ParseError(
                      lineNo,
                      `INDEX command must come before than POSTGAP command`,
                    ),
                  )
                }
              }

              const isFirstIndexOfFile =
                processingContext.file.tracks[0] === processingContext.track &&
                processingContext.track.indexes.length === 0

              if (isFirstIndexOfFile) {
                const badTime = time.frame > 0 || time.min > 0 || time.sec > 0

                if (badTime) {
                  takeIndex = false
                  if (!ignoreErrors) {
                    return left(
                      ParseError(
                        lineNo,
                        'The first INDEX of a FILE must have a time of 00:00:00',
                      ),
                    )
                  }
                }
              }

              const previousIndexInTrack =
                processingContext.track.indexes.length > 0
                  ? processingContext.track.indexes[
                      processingContext.track.indexes.length - 1
                    ]
                  : undefined

              if (previousIndexInTrack === undefined) {
                const badNumber = number > 1

                if (badNumber) {
                  takeIndex = false
                  if (!ignoreErrors) {
                    return left(
                      ParseError(
                        lineNo,
                        'The first INDEX of a TRACK must have a number equal to 00 or 01',
                      ),
                    )
                  }
                }
              } else {
                const badTime =
                  timeToSeconds(previousIndexInTrack.time) >=
                  timeToSeconds(time)
                const badNumber = number !== previousIndexInTrack.number + 1

                if (badTime || badNumber) {
                  takeIndex = false
                  if (!ignoreErrors) {
                    return left(
                      ParseError(
                        lineNo,
                        badTime
                          ? 'INDEX command must have a time greater than the previous index in the same TRACK'
                          : 'INDEX command must have a number sequential to the previous index in the same TRACK',
                      ),
                    )
                  }
                } else {
                  if (
                    takeIndex &&
                    previousIndexInTrack.number === 0 &&
                    processingContext.track.pregap === null
                  ) {
                    const pregap = diffTime(time, previousIndexInTrack.time)
                    processingContext.track.pregap = pregap
                  }
                }
              }

              if (takeIndex) {
                processingContext.track.indexes.push({ number, time })
              }
            }
          }
        } else {
          if (!ignoreErrors) {
            return left(
              ParseError(
                lineNo,
                'INDEX command must come in a "Track" context',
              ),
            )
          }
        }

        break
      }
      case 'ISRC': {
        const [code] = params

        if (code === undefined) {
          if (!ignoreErrors) {
            return left(
              ParseError(lineNo, `ISRC command must have one argument`),
            )
          }
        } else if (!isValidISRCCode(code)) {
          if (!ignoreErrors) {
            return left(
              ParseError(
                lineNo,
                `ISRC command code must be a valid International Standard Recording Code`,
              ),
            )
          }
        } else {
          if (isTrackProcessingContext(processingContext)) {
            if (processingContext.track.indexes.length > 0) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    'ISRC command must come before any INDEX command',
                  ),
                )
              }
            } else {
              if (processingContext.track.type === 'AUDIO') {
                processingContext.track.isrc = code
              }
            }
          } else {
            if (!ignoreErrors) {
              return left(
                ParseError(
                  lineNo,
                  `ISRC command must come in a "Track" context`,
                ),
              )
            }
          }
        }

        break
      }
      case 'POSTGAP': {
        const [timeStr] = params

        if (isTrackProcessingContext(processingContext)) {
          if (timeStr === undefined) {
            if (!ignoreErrors) {
              return left(
                ParseError(lineNo, 'POSTGAP command must have one parameters'),
              )
            }
          } else {
            const time = timeFromString(timeStr)

            if (time === null) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    'POSTGAP command time must be in mm:ss:ff format',
                  ),
                )
              }
            } else {
              processingContext.track.postgap = time
            }
          }
        } else {
          if (!ignoreErrors) {
            return left(
              ParseError(
                lineNo,
                `POSTGAP command must come in a "Track" context`,
              ),
            )
          }
        }
        break
      }
      case 'PREGAP': {
        const [timeStr] = params

        if (isTrackProcessingContext(processingContext)) {
          if (timeStr === undefined) {
            if (!ignoreErrors) {
              return left(
                ParseError(lineNo, 'PREGAP command must have one parameters'),
              )
            }
          } else {
            const time = timeFromString(timeStr)

            if (time === null) {
              if (!ignoreErrors) {
                return left(
                  ParseError(
                    lineNo,
                    'PREGAP command time must be in mm:ss:ff format',
                  ),
                )
              }
            } else {
              if (processingContext.track.indexes.length > 0) {
                if (!ignoreErrors) {
                  return left(
                    ParseError(
                      lineNo,
                      `PREGAP command must come before than INDEX command`,
                    ),
                  )
                }
              } else {
                processingContext.track.pregap = time
              }
            }
          }
        } else {
          if (!ignoreErrors) {
            return left(
              ParseError(
                lineNo,
                `PREGAP command must come in a "Track" context`,
              ),
            )
          }
        }
        break
      }
      case 'REM': {
        break
      }
    }
  }

  return ignoreErrors ? cueSheet : right(cueSheet)
}

export type CueSheet = {
  catalog: string | null
  cdTextFile: string | null
  files: CueSheetFile[]
  performer: string | null
  rem: string[]
  songWriter: string | null
  title: string | null
}

export interface CueSheetFile {
  name: string
  tracks: CueSheetTrack[]
  type: FileType
}

export interface CueSheetTrack {
  flags: TrackFlag[]
  indexes: CueSheetTrackIndex[]
  isrc: string | null
  number: number
  offset: CueSheetTime | null
  offsetSeconds: number | null
  performer: string | null
  pregap: CueSheetTime | null
  postgap: CueSheetTime | null
  songWriter: string | null
  title: string | null
  type: TrackType
}
