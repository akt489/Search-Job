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
                fetch: 'readonly',
                AbortController: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
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
