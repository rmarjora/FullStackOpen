module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        "jest/globals": true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: [
        'react'
    ],
    rules: {
        // Add custom rules here
        'react/prop-types': 'off',
        'no-unused-vars': 'warn',
        'no-console': 'off'
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};