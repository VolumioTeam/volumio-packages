import { isLeft, isRight } from 'fp-ts/lib/Either'

import { Parsed } from '../../src/core/Parsed'
import { CueSheetTime } from '../../src/core/utils/time'
import { getNewCueSheet, TestCueText } from '../fixtures'

describe('core/Parsed(cueSheet, lines, ignoreErrors)', () => {
  const testCueSheet = Parsed(getNewCueSheet(), TestCueText.split('\n'), true)

  test('skips empty or unvalid lines', () => {
    const cueSheet = getNewCueSheet()
    const result = Parsed(
      cueSheet,
      ['', 'hello', '56', 'TITLE "My title"'],
      false,
    )
    if (isLeft(result)) {
      throw new Error(`result is Left<${JSON.stringify(result.left)}>`)
    }

    expect(result.right).toBe(cueSheet)
  })

  test('CATALOG command', () => {
    expect(testCueSheet.catalog).toBe('1234567890123')
  })
  test('CDTEXTFILE command', () => {
    expect(testCueSheet.cdTextFile).toBe('my cdtext.cdt')
  })
  test('TITLE command', () => {
    expect(testCueSheet.title).toBe('The best album')
    expect(testCueSheet.files[0].tracks[0].title).toBe('Track one')
    expect(testCueSheet.files[0].tracks[1].title).toBe('Track two')
    expect(testCueSheet.files[1].tracks[0].title).toBe('Track three')
    expect(testCueSheet.files[1].tracks[1].title).toBe('Track four')
  })
  test('PERFORMER command', () => {
    expect(testCueSheet.performer).toBe('Famous singer')
    expect(testCueSheet.files[0].tracks[0].performer).toBe('Singer')
    expect(testCueSheet.files[0].tracks[1].performer).toBe('Singer')
    expect(testCueSheet.files[1].tracks[0].performer).toBe('Singer')
    expect(testCueSheet.files[1].tracks[1].performer).toBe('Singer four')
  })
  test('SONGWRITER command', () => {
    expect(testCueSheet.songWriter).toBe('Famous songwriter')
    expect(testCueSheet.files[0].tracks[0].songWriter).toBe('Songwriter')
    expect(testCueSheet.files[0].tracks[1].songWriter).toBe('Songwriter')
    expect(testCueSheet.files[1].tracks[0].songWriter).toBe('Songwriter')
    expect(testCueSheet.files[1].tracks[1].songWriter).toBe(null)
  })
  test('FILE command', () => {
    expect(testCueSheet.files.length).toBe(2)
    expect(testCueSheet.files[0].type).toBe('WAVE')
    expect(testCueSheet.files[1].type).toBe('MP3')
  })
  test('TRACK command', () => {
    expect(testCueSheet.files[0].tracks[0].type).toBe('AUDIO')
    expect(testCueSheet.files[0].tracks[0].number).toBe(1)
    expect(testCueSheet.files[0].tracks[1].type).toBe('AUDIO')
    expect(testCueSheet.files[0].tracks[1].number).toBe(2)
    expect(testCueSheet.files[1].tracks[0].type).toBe('AUDIO')
    expect(testCueSheet.files[1].tracks[0].number).toBe(3)
    expect(testCueSheet.files[1].tracks[1].type).toBe('AUDIO')
    expect(testCueSheet.files[1].tracks[1].number).toBe(4)
  })
  test('ISRC command', () => {
    expect(testCueSheet.files[0].tracks[0].isrc).toBe('AAAAA1234567')
    expect(testCueSheet.files[0].tracks[1].isrc).toBe('AAAAA1234567')
    expect(testCueSheet.files[1].tracks[0].isrc).toBe('AAAAA1234567')
    expect(testCueSheet.files[1].tracks[1].isrc).toBe(null)
  })
  test('PREGAP command', () => {
    expect(testCueSheet.files[0].tracks[1].pregap).toEqual<CueSheetTime>({
      min: 0,
      sec: 2,
      frame: 0,
    })
  })
  test('POSTGAP command', () => {
    expect(testCueSheet.files[0].tracks[1].postgap).toEqual<CueSheetTime>({
      min: 0,
      sec: 2,
      frame: 0,
    })
  })
  test('INDEX command', () => {
    /**
     * File 1
     */
    expect(testCueSheet.files[0].tracks[0].indexes.length).toBe(1)
    expect(testCueSheet.files[0].tracks[0].indexes[0].number).toBe(1)
    expect(testCueSheet.files[0].tracks[0].indexes[0].time).toEqual<
      CueSheetTime
    >({
      min: 0,
      sec: 0,
      frame: 0,
    })

    expect(testCueSheet.files[0].tracks[1].indexes.length).toBe(1)
    expect(testCueSheet.files[0].tracks[1].indexes[0].number).toBe(1)
    expect(testCueSheet.files[0].tracks[1].indexes[0].time).toEqual<
      CueSheetTime
    >({
      min: 2,
      sec: 0,
      frame: 0,
    })

    /**
     * File 2
     */
    expect(testCueSheet.files[1].tracks[0].indexes.length).toBe(2)
    expect(testCueSheet.files[1].tracks[0].indexes[0].number).toBe(0)
    expect(testCueSheet.files[1].tracks[0].indexes[0].time).toEqual<
      CueSheetTime
    >({
      min: 0,
      sec: 0,
      frame: 0,
    })

    expect(testCueSheet.files[1].tracks[0].indexes[1].number).toBe(1)
    expect(testCueSheet.files[1].tracks[0].indexes[1].time).toEqual<
      CueSheetTime
    >({
      min: 0,
      sec: 4,
      frame: 12,
    })

    expect(testCueSheet.files[1].tracks[1].indexes.length).toBe(1)
    expect(testCueSheet.files[1].tracks[1].indexes[0].number).toBe(1)
    expect(testCueSheet.files[1].tracks[1].indexes[0].time).toEqual<
      CueSheetTime
    >({
      min: 3,
      sec: 32,
      frame: 0,
    })
  })
  test('INDEX command can determine pregap', () => {
    expect(testCueSheet.files[1].tracks[0].pregap).toEqual<CueSheetTime>({
      min: 0,
      sec: 4,
      frame: 12,
    })
  })

  describe('Parse errors', () => {
    describe('Error: "{command}" is not a valid CUE command', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['unvalid hello'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(`"UNVALID" is not a valid CUE command`)
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['unvalid hello'], true)
        expect(result).toBe(cueSheet)
      })
    })

    describe('CATALOG command must have one parameter', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['CATALOG "'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CATALOG command must have one parameter`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['CATALOG "'], true)

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })
    describe('CATALOG command must come before than CDTEXTFILE command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['CDTEXTFILE "my cdtext.cdt"', 'CATALOG 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CATALOG command must come before than CDTEXTFILE command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['CDTEXTFILE "my cdtext.cdt"', 'CATALOG 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })
    describe('CATALOG command must come before than TITLE command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['TITLE "A title"', 'CATALOG 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CATALOG command must come before than TITLE command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['TITLE "A title"', 'CATALOG 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })
    describe('CATALOG command must come before than PERFORMER command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['PERFORMER Singer', 'CATALOG 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CATALOG command must come before than PERFORMER command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['PERFORMER Singer', 'CATALOG 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })
    describe('CATALOG command must come before than SONGWRITER command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['SONGWRITER Singer', 'CATALOG 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CATALOG command must come before than SONGWRITER command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['SONGWRITER Singer', 'CATALOG 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })
    describe('CATALOG command mcn must be a valid Media Catalog Number', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['CATALOG hello'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CATALOG command mcn must be a valid Media Catalog Number`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['CATALOG hello'], true)

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })
    describe('CATALOG must be a top level command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['FILE "File 01.flac" WAVE', 'CATALOG hello'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(`CATALOG must be a top level command`)
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['FILE "File 01.flac" WAVE', 'CATALOG hello'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.catalog).toBe(null)
      })
    })

    describe('CDTEXTFILE command must have one parameter', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['CDTEXTFILE "'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CDTEXTFILE command must have one parameter`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['CDTEXTFILE "'], true)

        expect(result).toBe(cueSheet)
        expect(result.cdTextFile).toBe(null)
      })
    })
    describe('CDTEXTFILE command must come before than TITLE command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['TITLE "A title"', 'CDTEXTFILE 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CDTEXTFILE command must come before than TITLE command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['TITLE "A title"', 'CDTEXTFILE 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.cdTextFile).toBe(null)
      })
    })
    describe('CDTEXTFILE command must come before than PERFORMER command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['PERFORMER Singer', 'CDTEXTFILE 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CDTEXTFILE command must come before than PERFORMER command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['PERFORMER Singer', 'CDTEXTFILE 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.cdTextFile).toBe(null)
      })
    })
    describe('CDTEXTFILE command must come before than SONGWRITER command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['SONGWRITER Singer', 'CDTEXTFILE 1234567890123'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CDTEXTFILE command must come before than SONGWRITER command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['SONGWRITER Singer', 'CDTEXTFILE 1234567890123'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.cdTextFile).toBe(null)
      })
    })
    describe('CDTEXTFILE must be a top level command', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['FILE "File 01.flac" WAVE', 'CDTEXTFILE hello'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `CDTEXTFILE must be a top level command`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['FILE "File 01.flac" WAVE', 'CDTEXTFILE hello'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.cdTextFile).toBe(null)
      })
    })

    describe('TITLE command must have one parameter', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['TITLE "'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `TITLE command must have one parameter`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['TITLE "'], true)

        expect(result).toBe(cueSheet)
        expect(result.title).toBe(null)
      })
    })
    describe('TITLE command must come before any INDEX command in "Track" context', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          [
            'FILE hello.mp3 MP3',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
            '       TITLE MyTitle',
          ],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `TITLE command must come before any INDEX command in "Track" context`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          [
            'FILE hello.mp3 MP3',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
            '       TITLE MyTitle',
          ],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.files[0].tracks[0].title).toBe(null)
      })
    })
    describe('TITLE command must come in the "None" or in the "Track" context', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          [
            'FILE hello.mp3 MP3',
            '   TITLE MyTitle',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
          ],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          'TITLE command must come in the "None" or in the "Track" context',
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          [
            'FILE hello.mp3 MP3',
            '   TITLE MyTitle',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
          ],
          true,
        )

        expect(result).toBe(cueSheet)
      })
    })

    describe('PERFORMER command must have one parameter', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['PERFORMER "'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `PERFORMER command must have one parameter`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['PERFORMER "'], true)

        expect(result).toBe(cueSheet)
        expect(result.performer).toBe(null)
      })
    })
    describe('PERFORMER command must come before any INDEX command in "Track" context', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          [
            'FILE hello.mp3 MP3',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
            '       PERFORMER MyTitle',
          ],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `PERFORMER command must come before any INDEX command in "Track" context`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          [
            'FILE hello.mp3 MP3',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
            '       PERFORMER MyTitle',
          ],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.files[0].tracks[0].performer).toBe(null)
      })
    })
    describe('PERFORMER command must come in the "None" or in the "Track" context', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          [
            'FILE hello.mp3 MP3',
            '   PERFORMER MyTitle',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
          ],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          'PERFORMER command must come in the "None" or in the "Track" context',
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          [
            'FILE hello.mp3 MP3',
            '   PERFORMER MyTitle',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
          ],
          true,
        )

        expect(result).toBe(cueSheet)
      })
    })

    describe('SONGWRITER command must have one parameter', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['SONGWRITER "'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `SONGWRITER command must have one parameter`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['SONGWRITER "'], true)

        expect(result).toBe(cueSheet)
        expect(result.songWriter).toBe(null)
      })
    })
    describe('SONGWRITER command must come before any INDEX command in "Track" context', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          [
            'FILE hello.mp3 MP3',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
            '       SONGWRITER MyTitle',
          ],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `SONGWRITER command must come before any INDEX command in "Track" context`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          [
            'FILE hello.mp3 MP3',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
            '       SONGWRITER MyTitle',
          ],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.files[0].tracks[0].songWriter).toBe(null)
      })
    })
    describe('SONGWRITER command must come in the "None" or in the "Track" context', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          [
            'FILE hello.mp3 MP3',
            '   SONGWRITER MyTitle',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
          ],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          'SONGWRITER command must come in the "None" or in the "Track" context',
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          [
            'FILE hello.mp3 MP3',
            '   SONGWRITER MyTitle',
            '   TRACK 01 AUDIO',
            '       INDEX 01 00:00:00',
          ],
          true,
        )

        expect(result).toBe(cueSheet)
      })
    })

    describe('FILE command must have two parameters', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['FILE hello.mp3'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `FILE command must have two parameters`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['FILE hello.mp3'], true)

        expect(result).toBe(cueSheet)
        expect(result.files.length).toBe(0)
      })
    })
    describe('FILE command file-type must be one of ...', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['FILE hello.mp3 FAKETYPE'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(
          result.left.message.startsWith(
            'FILE command file-type must be one of',
          ),
        ).toBe(true)
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['FILE hello.mp3 FAKETYPE'], true)

        expect(result).toBe(cueSheet)
        expect(result.files.length).toBe(0)
      })
    })

    describe('TRACK command must come in a "File" context', () => {
      test('fires', () => {
        const result = Parsed(getNewCueSheet(), ['TRACK 01 AUDIO'], false)

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          'TRACK command must come in a "File" context',
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(cueSheet, ['TRACK 01 AUDIO'], true)

        expect(result).toBe(cueSheet)
        expect(result.files.length).toBe(0)
      })
    })
    describe('TRACK command must have two parameters', () => {
      test('fires', () => {
        const result = Parsed(
          getNewCueSheet(),
          ['FILE hello.mp3 MP3', '  TRACK "MyTrack"'],
          false,
        )

        if (isRight(result)) {
          throw new Error(`result is Right<${JSON.stringify(result.right)}>`)
        }

        expect(result.left.message).toBe(
          `TRACK command must have two parameters`,
        )
      })
      test('could ignore', () => {
        const cueSheet = getNewCueSheet()
        const result = Parsed(
          cueSheet,
          ['FILE hello.mp3 MP3', '  TRACK "MyTrack"'],
          true,
        )

        expect(result).toBe(cueSheet)
        expect(result.files[0].tracks.length).toBe(0)
      })
    })
  })
})
