import js from '@eslint/js';

export default [
    {
        files: ['src/**/*.js', 'tests/**/*.js', 'scripts/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                URL: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                beforeEach: 'readonly',
                afterAll: 'readonly',
                expect: 'readonly',
                jest: 'readonly',
                test: 'readonly',
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-console': 'off',
        },
    },
];
