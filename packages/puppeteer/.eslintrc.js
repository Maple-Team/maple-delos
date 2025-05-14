/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: '@liutsing/eslint-config',
  rules: {
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'prettier/prettier': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
}
