import { isLeft, isRight } from 'fp-ts/lib/Either'

import * as CueParser from '../src'
import {
  BadCuePath,
  BinaryFilePath,
  DirectoryPath,
  LiveInBerlinCuePath,
  NonExistentFilePath,
} from './fixtures'

describe('Module exports', () => {
  test('exports parse()', () => {
    expect(typeof CueParser.parse === 'function').toBe(true)
  })
  test('exports parseFile()', () => {
    expect(typeof CueParser.parseFile === 'function').toBe(true)
  })
  test('exports parseFileSync()', () => {
    expect(typeof CueParser.parseFileSync === 'function').toBe(true)
  })
  test('exports stringify()', () => {
    expect(typeof CueParser.stringify === 'function').toBe(true)
  })
})

describe('CueParser.parseFile(filePath)', () => {
  test('returns a promise', () => {
    const p = CueParser.parseFile(LiveInBerlinCuePath)
    expect(typeof p.then).toBe('function')
    expect(typeof p.catch).toBe('function')
  })
  test('returned promise always resolves', async () => {
    await CueParser.parseFile(LiveInBerlinCuePath)
    await CueParser.parseFile(NonExistentFilePath)
  })
  test('resolves with Left<FileNotFoundError> if a directory path is passed', async () => {
    const result = await CueParser.parseFile(DirectoryPath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('FILE_NOT_FOUND')
  })
  test('resolves with Left<FileNotFoundError> if file dows not exist', async () => {
    const result = await CueParser.parseFile(NonExistentFilePath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('FILE_NOT_FOUND')
  })
  test('resolves with Left<FileIsBinaryError> if file is binary', async () => {
    const result = await CueParser.parseFile(BinaryFilePath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('FILE_IS_BINARY')
  })
  test('resolves with Left<ParseError> if file is not valid', async () => {
    const result = await CueParser.parseFile(BadCuePath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('PARSE_ERROR')
  })
  test('resolves with Right<CueSheet> if file is valid', async () => {
    const result = await CueParser.parseFile(LiveInBerlinCuePath)
    if (isLeft(result)) {
      throw new Error(`result is Left<${JSON.stringify(result.left)}>`)
    }
  })
})

describe('CueParser.parseFileSync(filePath)', () => {
  test('returns Left<FileNotFoundError> if a directory path is passed', () => {
    const result = CueParser.parseFileSync(DirectoryPath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('FILE_NOT_FOUND')
  })
  test('returns Left<FileNotFoundError> if file dows not exist', () => {
    const result = CueParser.parseFileSync(NonExistentFilePath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('FILE_NOT_FOUND')
  })
  test('returns Left<FileIsBinaryError> if file is binary', () => {
    const result = CueParser.parseFileSync(BinaryFilePath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('FILE_IS_BINARY')
  })
  test('returns Left<ParseError> if file is not valid', () => {
    const result = CueParser.parseFileSync(BadCuePath)
    if (isRight(result)) {
      throw new Error('result is Right')
    }

    expect(result.left.type).toBe('PARSE_ERROR')
  })
  test('returns Right<CueSheet> if file is valid', () => {
    const result = CueParser.parseFileSync(LiveInBerlinCuePath)
    if (isLeft(result)) {
      throw new Error(`result is Left<${JSON.stringify(result.left)}>`)
    }
  })
})
