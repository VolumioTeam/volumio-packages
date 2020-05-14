const ISRC_REGEX = /^[A-Z\d]{5}\d{7}$/

export const isValidISRCCode = (code: string): boolean => ISRC_REGEX.test(code)
