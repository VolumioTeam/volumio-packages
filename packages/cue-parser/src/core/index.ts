import { Either } from 'fp-ts/lib/Either'

import { CueSheet, Parsed } from './Parsed'
import { ParseError } from './utils/ParseError'

export { CueSheet } from './Parsed'
export { ParseError } from './utils/ParseError'
export { stringify } from './utils/stringify'

export const parse: ParseFunction = (
  cueText: string,
  ignoreErrors?: boolean,
): any => {
  const lines = cueText.replace(/\r\n/, '\n').split('\n')

  const cueSheet: CueSheet = {
    catalog: null,
    cdTextFile: null,
    files: [],
    performer: null,
    rem: [],
    songWriter: null,
    title: null,
  }

  return ignoreErrors
    ? Parsed(cueSheet, lines, true)
    : Parsed(cueSheet, lines, false)
}

type ParseFunction = {
  (cueText: string, ignoreErrors?: false): Either<ParseError, CueSheet>
  (cueText: string, ignoreErrors: true): CueSheet
}
