import eslintJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import nodi from 'eslint-plugin-nodi';

/** Minimal parser so .module.css can be linted as a Program text blob. */
const cssTextParser = {
  parseForESLint(code) {
    return {
      ast: {
        type: 'Program',
        body: [],
        sourceType: 'module',
        tokens: [],
        comments: [],
        range: [0, code.length],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: code.split('\n').length, column: 0 },
        },
      },
      scopeManager: null,
      visitorKeys: { Program: [] },
    };
  },
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/cdk.out/**',
      'design/**',
      'content/**',
      '**/tokens/**',
      '**/next-env.d.ts',
    ],
  },
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: [
      'apps/web/**/*.{ts,tsx}',
      'packages/design-system/src/components/**/*.{ts,tsx}',
    ],
    plugins: { nodi },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'nodi/no-raw-color': 'error',
      'nodi/no-shadow': 'error',
    },
  },
  {
    files: [
      'apps/web/**/*.module.css',
      'packages/design-system/src/components/**/*.module.css',
    ],
    plugins: { nodi },
    languageOptions: {
      parser: cssTextParser,
    },
    rules: {
      'nodi/no-raw-color': 'error',
      'nodi/no-shadow': 'error',
      // CSS files are not JS; silence JS-oriented recommended rules.
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
);
