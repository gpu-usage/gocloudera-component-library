/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.{js,jsx}'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  clearMocks: true,
};
