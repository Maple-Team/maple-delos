/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: '@liutsing/eslint-config',
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },
}
