// .eslintrc.js

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint', 'styled-components-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Your custom rules
  },
};
