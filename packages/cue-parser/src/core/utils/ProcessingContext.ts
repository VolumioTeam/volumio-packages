import { CueSheetFile, CueSheetTrack } from '../Parsed'

export const ProcessingContext: ProcessingContextConstructor = (
  type: any,
  file?: any,
  track?: any,
): any => {
  const processingContext: ProcessingContext =
    type === 'None'
      ? { type: 'None' }
      : type === 'File'
      ? { type: 'File', file }
      : { type: 'Track', file, track }

  return processingContext
}

export const isNoneProcessingContext = (
  context: ProcessingContext,
): context is NoneProcessingContext => context.type === 'None'

export const isFileProcessingContext = (
  context: ProcessingContext,
): context is FileProcessingContext => context.type === 'File'

export const isTrackProcessingContext = (
  context: ProcessingContext,
): context is TrackProcessingContext => context.type === 'Track'

type ProcessingContextConstructor = {
  (type: 'None'): NoneProcessingContext
  (type: 'File', file: CueSheetFile): FileProcessingContext
  (
    type: 'Track',
    file: CueSheetFile,
    track: CueSheetTrack,
  ): TrackProcessingContext
}

export type ProcessingContext =
  | NoneProcessingContext
  | FileProcessingContext
  | TrackProcessingContext

type NoneProcessingContext = {
  type: 'None'
}

type FileProcessingContext = {
  type: 'File'
  file: CueSheetFile
}

type TrackProcessingContext = {
  type: 'Track'
  file: CueSheetFile
  track: CueSheetTrack
}
