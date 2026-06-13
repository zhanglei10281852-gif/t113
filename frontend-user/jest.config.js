module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': '<rootDir>/tests/unit/__mocks__/styleMock.js',
    '^vant(.*)$': '<rootDir>/__mocks__/vant.js'
  },
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!vant)'
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  testMatch: ['**/tests/unit/**/*.spec.js'],
  collectCoverageFrom: [
    'src/store/**/*.js',
    'src/api/**/*.js',
    'src/mock/**/*.js'
  ]
}
