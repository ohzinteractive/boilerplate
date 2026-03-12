import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Base configuration for all JavaScript files
  {
    files: ['**/*.js', '**/*.jsx'],
    ...js.configs.recommended,
    rules: {
      ...js.configs.recommended.rules,
      /* 🔥 GENERAL CODE STYLE RULES FOR ALL FILES */

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
      'camelcase': 'off',
      'import/no-absolute-path': 'off',
      'import/no-duplicates': 'off',
      'linebreak-style': 'off',
      'no-multi-spaces': 'off',
      'no-useless-constructor': 'off',
      'no-undef-init': 'off',
    }
  },

  // Base configuration for TypeScript files with type checking
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),

  // Configuration for TypeScript files - includes type checking rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true, // uses tsconfig.json
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      /* 🔥 TYPESCRIPT-SPECIFIC TYPE CHECKING RULES */
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',

      /* 🔥 GENERAL CODE STYLE RULES (SAME AS JS FILES) */
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
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',

      // Disabled rules
      'camelcase': 'off',
      'import/no-absolute-path': 'off',
      'import/no-duplicates': 'off',
      'linebreak-style': 'off',
      'no-multi-spaces': 'off',
      'no-useless-constructor': 'off',
      'no-undef-init': 'off',
      'no-unused-vars': 'off', // Use TS version instead
      'no-undef': 'off' // TypeScript handles this
    }
  }
];
