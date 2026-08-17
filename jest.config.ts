import createJestConfig from 'next/jest.js';

const config = createJestConfig({
  dir: './',
})({
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // informa ao Jest qual arquivo executar antes dos testes, depois que o ambiente de teste foi configurado.
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {},
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/e2e/',
    '/src/components/ui/',
    '/src/lib/',
    '/src/generated/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/e2e/',
  ],
});

export default config;
