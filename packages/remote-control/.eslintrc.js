/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: '@liutsing/eslint-config',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': 'off',
    '@typescript-eslint/indent': 'off',
    'multiline-ternary': 'off',
    'operator-linebreak': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
}
