/**
 * @type {import('jest').Config}
 */
const config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // runtime
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
}

module.exports = config
