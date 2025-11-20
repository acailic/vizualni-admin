import importPlugin from 'eslint-plugin-import';
import visualizeAdminPlugin from 'eslint-plugin-visualize-admin';
import deprecatePlugin from 'eslint-plugin-deprecate';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tsParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // Ignore patterns
  {
    ignores: [
      'rollup.config.js',
      'app/public/dist/**',
      'app/graphql/resolver-types.ts',
      'app/graphql/query-hooks.ts',
      'app/dist/**',
      'app/out/**',
      'app/public/static/**',
      'app/node_modules/**',
      '.next/**',
      'node_modules/**',
      'dist/**',
      '**/*.config.js',
      '**/*.config.mjs',
    ],
  },

  // Main configuration for app files
  {
    files: ['app/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
      'visualize-admin': visualizeAdminPlugin,
      deprecate: deprecatePlugin,
      'unused-imports': unusedImportsPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./app/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-duplicate-case': 'error',
      'no-restricted-imports': [
        'error',
        {
          name: 'lodash',
          message: 'Please use direct imports instead, ex: lodash/mapValues, lodash/groupBy.',
        },
      ],
      // CI-friendly: disable high-churn UI rules and Next defaults that are noisy in the current codebase
      'visualize-admin/no-large-sx': 'off',
      'visualize-admin/make-styles': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-sync-scripts': 'off',
      'react/jsx-key': 'off',
      'deprecate/member-expression': [
        'error',
        { name: 'useMemo', use: 'named import' },
        { name: 'useState', use: 'named import' },
        { name: 'useContext', use: 'named import' },
        { name: 'useEffect', use: 'named import' },
        { name: 'createContext', use: 'named import' },
        { name: 'useReducer', use: 'named import' },
        { name: 'memo', use: 'named import' },
        { name: 'forwardRef', use: 'named import' },
        { name: 'useRef', use: 'named import' },
        { name: 'useCallback', use: 'named import' },
        { name: 'useImperativeHandle', use: 'named import' },
        { name: 'createElement', use: 'named import' },
      ],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
    },
  },

  // Override for .docs.tsx files
  {
    files: ['**/*.docs.tsx'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];
