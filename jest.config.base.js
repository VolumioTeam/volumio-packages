module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/tests/.*.(test|spec)).(jsx?|tsx?)$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
}
