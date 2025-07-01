module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
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