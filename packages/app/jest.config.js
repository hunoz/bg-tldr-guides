/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react',
                    esModuleInterop: true,
                    allowJs: true,
                    resolveJsonModule: true,
                    moduleResolution: 'node',
                    strict: true,
                },
                diagnostics: {
                    exclude: ['**/components/**'],
                },
            },
        ],
    },
    moduleNameMapper: {
        '^react-native$': '<rootDir>/__mocks__/react-native.ts',
        '^@/(.*)$': '<rootDir>/$1',
    },
};
