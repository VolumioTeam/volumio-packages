import { Either, left } from 'fp-ts/lib/Either'
import fs from 'fs'
import { promisify } from 'util'

import { CueSheet, parse, ParseError } from './core'
import { getBufferEncoding } from './getBufferEncoding'

export { CueSheet, parse, ParseError, stringify } from './core'

const existsAsync = promisify(fs.exists)
const statAsync = promisify(fs.stat)
const readFileAsync = promisify(fs.readFile)

export const parseFile = async (
  filePath: string,
): Promise<Either<ParseFileError, CueSheet>> => {
  const fileExists = await existsAsync(filePath)

  if (!fileExists) {
    return left({ type: 'FILE_NOT_FOUND' })
  }

  const stats = await statAsync(filePath)

  if (!stats.isFile()) {
    return left({ type: 'FILE_NOT_FOUND' })
  }

  const fileBuffer = await readFileAsync(filePath)

  const bufferEncoding = getBufferEncoding(fileBuffer)

  return bufferEncoding === 'UTF8'
    ? parse(fileBuffer.toString())
    : left({
        type: 'FILE_IS_BINARY',
      })
}

export const parseFileSync = (
  filePath: string,
): Either<ParseFileError, CueSheet> => {
  const fileExists = fs.existsSync(filePath)

  if (!fileExists) {
    return left({ type: 'FILE_NOT_FOUND' })
  }

  const stats = fs.statSync(filePath)

  if (!stats.isFile()) {
    return left({ type: 'FILE_NOT_FOUND' })
  }

  const fileBuffer = fs.readFileSync(filePath)

  const bufferEncoding = getBufferEncoding(fileBuffer)

  return bufferEncoding === 'UTF8'
    ? parse(fileBuffer.toString())
    : left({
        type: 'FILE_IS_BINARY',
      })
}

export type ParseFileError = FileNotFoundError | FileIsBinaryError | ParseError

type FileNotFoundError = {
  type: 'FILE_NOT_FOUND'
}

type FileIsBinaryError = {
  type: 'FILE_IS_BINARY'
}
