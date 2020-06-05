// eslint-disable-next-line no-undef
module.exports = {
  name: 'openapi-sdk',
  preset: '../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/openapi-sdk',
}
