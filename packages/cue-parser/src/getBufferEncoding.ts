/**
 * The credit for this function code goes to https://github.com/bevry/istextorbinary
 */
export const getBufferEncoding = (
  buffer: Buffer,
  options?: Options,
): 'UTF8' | 'BINARY' => {
  const textEncoding = 'UTF8'
  const binaryEncoding = 'BINARY'

  if (options === undefined) {
    const chunkLength = 100

    let encoding = getBufferEncoding(buffer, { chunkLength, chunkBegin: 0 })

    if (encoding === textEncoding) {
      // Middle
      let chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength)
      encoding = getBufferEncoding(buffer, { chunkLength, chunkBegin })

      if (encoding === textEncoding) {
        // End
        chunkBegin = Math.max(0, buffer.length - chunkLength)
        encoding = getBufferEncoding(buffer, { chunkLength, chunkBegin })
      }
    }

    return encoding
  } else {
    const { chunkLength, chunkBegin } = options
    const chunkEnd = Math.min(buffer.length, chunkBegin + chunkLength)
    const contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd)

    for (let i = 0; i < contentChunkUTF8.length; ++i) {
      const charCode = contentChunkUTF8.charCodeAt(i)
      if (charCode === 65533 || charCode <= 8) {
        // 8 and below are control characters (e.g. backspace, null, eof, etc.)
        // 65533 is the unknown character
        return binaryEncoding
      }
    }

    return textEncoding
  }
}

type Options = {
  chunkLength: number
  chunkBegin: number
}
