const COMMAND_MATCHER = /([A-Za-z]+)\s+(.*)$/

export const parseLine = (line: string): Line | null => {
  const match = line.trim().match(COMMAND_MATCHER)

  if (match === null) {
    return null
  }

  return {
    command: match[1].toUpperCase(),
    params: parseParams(match[2]),
  }
}

const parseParams = (str: string): LineParams => {
  let params = [] as LineParams
  let remaining = str

  while (remaining.length > 0) {
    if (remaining.startsWith('"')) {
      const nextQuoteIndex = remaining.indexOf('"', 1)
      if (nextQuoteIndex > 1) {
        params = [
          ...params,
          remaining.substring(1, nextQuoteIndex),
        ] as LineParams
        remaining = remaining.substring(nextQuoteIndex + 1).trim()
      } else {
        remaining = remaining.substring(nextQuoteIndex === 1 ? 2 : 1).trim()
      }
    } else {
      const [param, ...rest] = remaining.split(' ')
      params = [...params, param] as LineParams
      remaining = rest.join(' ').trim()
    }
  }

  return params
}

export type Line = {
  command: string
  params: LineParams
}

export type LineParams =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
