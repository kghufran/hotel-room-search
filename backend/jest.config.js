module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    rootDir: 'src',
    testMatch: ['**/?(*.)+(spec|test).ts'],
    globals: {
      'ts-jest': {
        tsconfig: './tsconfig.json',
      },
    },
  };
  