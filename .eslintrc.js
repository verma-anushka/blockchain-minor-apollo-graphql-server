module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'graphql',
  ],
  rules: {
    'no-unused-vars': 0,
    'no-console': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'no-underscore-dangle': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
