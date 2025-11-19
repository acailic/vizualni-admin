import importPlugin from 'eslint-plugin-import';
import visualizeAdminPlugin from 'eslint-plugin-visualize-admin';
import deprecatePlugin from 'eslint-plugin-deprecate';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
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
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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
      'visualize-admin/no-large-sx': 'error',
      'visualize-admin/make-styles': 'error',
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
