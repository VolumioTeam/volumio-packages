import {
  isFileProcessingContext,
  isNoneProcessingContext,
  isTrackProcessingContext,
  ProcessingContext,
} from '../../../src/core/utils/ProcessingContext'

describe('core/utils/ProcessingContext', () => {
  test('isFileProcessingContext', () => {
    expect(isFileProcessingContext({ type: 'File' } as ProcessingContext)).toBe(
      true,
    )
  })
  test('isNoneProcessingContext', () => {
    expect(isNoneProcessingContext({ type: 'None' } as ProcessingContext)).toBe(
      true,
    )
  })
  test('isTrackProcessingContext', () => {
    expect(
      isTrackProcessingContext({ type: 'Track' } as ProcessingContext),
    ).toBe(true)
  })
})
