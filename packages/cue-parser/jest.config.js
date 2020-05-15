const base = require('../../jest.config.base')

const pkg = require('./package.json')

module.exports = {
  ...base,
  roots: [`<rootDir>/packages/cue-parser`],
  collectCoverageFrom: ['src/**/*.ts'],
  testRegex: `packages/cue-parser/tests/.*.(test|spec).ts$`,
  moduleDirectories: ['node_modules'],
  modulePaths: [`<rootDir>/packages/cue-parser/src/`],
  name: pkg.name,
  displayName: pkg.name,
  rootDir: '../..',
}
