module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/client/'],
	verbose: true,
	transform: {
		'^.+\\.ts$': ['ts-jest', { tsconfig: 'test/tsconfig.json' }],
	},
	testTimeout: 30000,
};
