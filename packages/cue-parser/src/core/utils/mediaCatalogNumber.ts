const MCN_REGEX = /^\d{13}$/

export const isValidMediaCatalogNumber = (mcn: string): boolean =>
  MCN_REGEX.test(mcn)
