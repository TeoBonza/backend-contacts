module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
};