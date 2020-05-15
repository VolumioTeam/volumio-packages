# `@volumio/cue-parser`

A library to parse [CUE files](<https://en.wikipedia.org/wiki/Cue_sheet_(computing)>).

The implementation adheres to the [CUE specification described here](https://www.gnu.org/software/ccd2cue/manual/html_node/CUE-sheet-format.html).

## Usage

```typescript
import { fold } from 'fp-ts/lib/Either'

import { parseFile, ParseFileError, CueSheet } from '@volumio/cue-parser'

/**
 * This package use a functional approach to error handling
 * thanks to the wonderful `fp-ts` library
 */
const useResult = fold(
  function onError(error: ParseFileError) {
    console.error(error.type) // FILE_NOT_FOUND | PARSE_ERROR

    if (error.type === 'PARSE_ERROR') {
      console.error(`Message: ${error.message}`)
      console.error(`On line number ${error.line} of CUE file`)
    }
  },
  function onSuccess(cueSheet: CueSheet) {
    return cueSheet
  },
)

/**
 * so result here will be Either<ParseFileError, CueSheet>
 */
const result = await parseFile('./path/to/file.cue') // or parseFileSync(...)

const cueSheet: CueSheet | undefined = useResult(result)
```

## Usage in browser

Of course the `fs` module is not available in the browser environment; still you can use this library to parse a `string` or `Buffer` representation of a `.cue` file.

```typescript
import { parse, ParseError, CueSheet } from '@volumio/cue-parser/core'

const cueText: string | Buffer = '...'
const result: Either<ParseError, CueSheet> = parse(cueText)
```

## Ignoring errors

Sometime something is better than nothing (if you do not care about errors).

If you are facing files which do not fully adhere to the `.cue` spec and you still want them to be parsed on a best effort basis, you can do it with the core `parse` function.

```typescript
import { parse, CueSheet } from '@volumio/cue-parser/core'

const cueText = '...'

const result: CueSheet = parse(cueText, true /* ignore errors*/)

// NOTE: if you ignore errors, `parse` will always return a CueSheet, not an Either<...>
```

## Convert back a CueSheet to its text representation

```typescript
import { stringify } from '@volumio/cue-parser'

const cueSheet: CueSheet = {...}

const cueFileContent = stringify(cueSheet)
```
