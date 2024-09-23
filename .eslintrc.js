module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist', 'unused-imports', 'mui-path-imports'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'mui-path-imports/mui-path-imports': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unused-imports/no-unused-imports': 1,
    'unused-imports/no-unused-vars': [
      0,
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'perfectionist/sort-named-imports': [
      1,
      {
        order: 'asc',
        type: 'line-length',
      },
    ],
    'perfectionist/sort-named-exports': [
      1,
      {
        order: 'asc',
        type: 'line-length',
      },
    ],
    'perfectionist/sort-exports': [
      1,
      {
        order: 'asc',
        type: 'line-length',
      },
    ],
    'perfectionist/sort-imports': [
      1,
      {
        order: 'asc',
        type: 'line-length',
        'newlines-between': 'always',
        'internal-pattern': ['src/**'],
      },
    ],
  },
};
