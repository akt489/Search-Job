import js from '@eslint/js';

export default [
    {
        files: ['src/**/*.js', 'tests/**/*.js'],
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
                setInterval: 'readonly',
                clearInterval: 'readonly',
                fetch: 'readonly',
                AbortController: 'readonly',
                TextEncoder: 'readonly',
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
