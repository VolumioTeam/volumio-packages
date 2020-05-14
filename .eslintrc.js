module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'plugin:eslint-comments/recommended',
  ],

  overrides: [
    {
      files: ['*.js'],
      parserOptions: {
        ecmaVersion: 2018,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
      rules: {
        'sort-imports': 'off',
        'import/order': 'off',

        'simple-import-sort/sort': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],

        'no-dupe-class-members': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
}
