import { CueSheet } from '../Parsed'
import { CueSheetTime } from './time'

export const stringify = (cueSheet: CueSheet): string => {
  const lines: string[] = []

  if (cueSheet.catalog !== null) {
    lines.push(`CATALOG ${cueSheet.catalog}`)
  }
  if (cueSheet.cdTextFile !== null) {
    lines.push(`CDTEXTFILE ${quote(cueSheet.cdTextFile)}`)
  }

  cueSheet.rem.forEach((s) => {
    lines.push(`REM ${s}`)
  })

  if (cueSheet.title !== null) {
    lines.push(`TITLE ${quote(cueSheet.title.slice(0, 80))}`)
  }
  if (cueSheet.performer !== null) {
    lines.push(`PERFORMER ${quote(cueSheet.performer.slice(0, 80))}`)
  }
  if (cueSheet.songWriter !== null) {
    lines.push(`SONGWRITER ${quote(cueSheet.songWriter.slice(0, 80))}`)
  }

  cueSheet.files.forEach((file) => {
    lines.push(`FILE ${quote(file.name)} ${file.type}`)

    file.tracks.forEach((track) => {
      lines.push(`  TRACK ${padNumber(track.number)} ${track.type}`)
      if (track.title !== null) {
        lines.push(`    TITLE ${quote(track.title.slice(0, 80))}`)
      }
      if (track.performer !== null) {
        lines.push(`    PERFORMER ${quote(track.performer.slice(0, 80))}`)
      }
      if (track.songWriter !== null) {
        lines.push(`    SONGWRITER ${quote(track.songWriter.slice(0, 80))}`)
      }
      if (track.isrc !== null && track.type === 'AUDIO') {
        lines.push(`    ISRC ${track.isrc}`)
      }
      if (track.flags.length > 0) {
        lines.push(`    FLAGS ${track.flags.join(' ')}`)
      }

      if (track.pregap !== null) {
        lines.push(`    PREGAP ${timeToString(track.pregap)}`)
      }

      track.indexes.forEach((index) => {
        lines.push(
          `    INDEX ${padNumber(index.number)} ${timeToString(index.time)}`,
        )
      })

      if (track.postgap !== null) {
        lines.push(`    POSTGAP ${timeToString(track.postgap)}`)
      }
    })
  })

  return lines.join('\n')
}

const quote = (txt: string, force?: true): string =>
  force || /\s/.test(txt) ? `"${txt}"` : txt

const padNumber = (n: number): string => (n < 10 ? `0${n}` : `${n}`)

const timeToString = (time: CueSheetTime): string =>
  `${padNumber(time.min)}:${padNumber(time.sec)}:${padNumber(time.frame)}`
