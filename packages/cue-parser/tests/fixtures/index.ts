import fs from 'fs'
import path from 'path'

import { CueSheet } from '../../src'

export const BadCuePath = path.resolve(__dirname, 'Bad.cue')

export const BadCueText = fs.readFileSync(BadCuePath, { encoding: 'utf8' })

export const BinaryFilePath = path.resolve(__dirname, 'pixel.gif')

export const DirectoryPath = __dirname

export const LiveInBerlinCuePath = path.resolve(__dirname, 'LiveInBerlin.cue')

export const LiveInBerlinCueText = fs.readFileSync(LiveInBerlinCuePath, {
  encoding: 'utf8',
})

export const NonExistentFilePath = path.resolve(__dirname, 'missing.cue')

export const TestCuePath = path.resolve(__dirname, 'Test.cue')

export const TestCueText = fs.readFileSync(TestCuePath, { encoding: 'utf8' })

export const getNewCueSheet = (): CueSheet => ({
  catalog: null,
  cdTextFile: null,
  files: [],
  performer: null,
  rem: [],
  songWriter: null,
  title: null,
})
