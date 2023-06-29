/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: '@liutsing/eslint-config',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/require-await': 'off',
  },
}
