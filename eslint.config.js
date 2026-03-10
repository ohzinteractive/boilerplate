import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: true, // uses tsconfig.json
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      /* 🔥 MIGRATED CUSTOM RULES FROM .eslintrc.cjs */

      // TypeScript-specific rules
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // Code style rules (migrated from .eslintrc.cjs)
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'brace-style': ['error', 'allman'],
      'space-before-function-paren': ['error', 'never'],
      'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
      'init-declarations': ['error', 'always'],
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }],

      // Formatting rules
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',

      // Disabled rules (migrated from .eslintrc.cjs)
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'camelcase': 'off',
      'import/no-absolute-path': 'off',
      'import/no-duplicates': 'off',
      'linebreak-style': 'off',
      'no-multi-spaces': 'off',
      'no-useless-constructor': 'off',
      'no-undef-init': 'off',

      // Prefer TS over JS rules
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  }
];
