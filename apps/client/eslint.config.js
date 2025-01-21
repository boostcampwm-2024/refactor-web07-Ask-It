import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks'; // 추가
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{ts,tsx}'] },
  {
    ignores: [
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.ts',
      'vite-env.d.ts',
      'routeTree.gen.ts',
      'playwright.config.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
  },
  {
    plugins: {
      import: pluginImport,
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/jsx-no-duplicate-props': ['error'],
      'react/jsx-no-undef': ['error'],
      'react/jsx-max-depth': ['error', { max: 4 }],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      complexity: ['error', { max: 10 }],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['error', { max: 30, skipBlankLines: true, skipComments: true }],

      'import/extensions': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          pathGroups: [
            {
              pattern: '@/component/**',
              group: 'parent',
              position: 'before',
            },
            {
              pattern: '@/features/**',
              group: 'parent',
              position: 'before',
            },
          ],
          named: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  {
    ignores: ['**.spec.ts'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  prettier,
];
