module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    webextensions: true
  },
  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/typescript',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
