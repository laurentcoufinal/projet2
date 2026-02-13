
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary', 'json-summary'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.module.ts$',
    'main.ts',
    'app.config.ts',
    'app.routes.ts',
    '/models/',
  ],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
