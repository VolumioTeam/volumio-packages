export const ParseError = (line: number, message: string): ParseError => ({
  type: 'PARSE_ERROR',
  line,
  message,
})

export type ParseError = {
  type: 'PARSE_ERROR'
  line: number
  message: string
}
