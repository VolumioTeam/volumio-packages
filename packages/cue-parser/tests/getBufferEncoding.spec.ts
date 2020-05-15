import fs from 'fs'

import { getBufferEncoding } from '../src/getBufferEncoding'
import { BinaryFilePath, LiveInBerlinCuePath } from './fixtures'

describe('getBufferEncoding', () => {
  test('detects a text file', () => {
    const fileBuffer = fs.readFileSync(LiveInBerlinCuePath)
    const encoding = getBufferEncoding(fileBuffer)
    expect(encoding).toBe('UTF8')
  })
  test('detects a binary file', () => {
    const fileBuffer = fs.readFileSync(BinaryFilePath)
    const encoding = getBufferEncoding(fileBuffer)
    expect(encoding).toBe('BINARY')
  })
})
