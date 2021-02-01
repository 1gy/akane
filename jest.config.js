/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  testEnvironment: 'node',
  transform: {
    '\\.ts$': 'ts-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}

module.exports = config;
