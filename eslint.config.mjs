import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

// eslint-config-next/core-web-vitals is a flat-config-compatible array that
// bundles React, react-hooks, and Next.js rules in one import.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

/** @type {import('eslint').Linter.Config[]} */
const config = [

  // ── 1. Global ignores ──────────────────────────────────────────────────────
  // Applied before all other config objects; files here are never linted.
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      '*.config.js',
    ],
  },

  // ── 2. Base JS rules — applies to all JS and TS source files ───────────────
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ...js.configs.recommended,
    rules: {
      // Allow console.warn and console.error; flag console.log as a warning
      'no-console':     ['warn', { allow: ['warn', 'error'] }],
      // Prefer const over let whenever a binding is never reassigned
      'prefer-const':   'warn',
      // Disabled here — @typescript-eslint/no-unused-vars handles TS files
      'no-unused-vars': 'off',
      // Enforce strict equality everywhere (no == / !=)
      'eqeqeq':         ['warn', 'always'],
    },
  },

  // ── 3. TypeScript-specific rules — .ts and .tsx only ──────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project:     './tsconfig.json',
        ecmaVersion: 2022,
        sourceType:  'module',
        // Required for consistent-type-imports rule
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      // Report unused variables; allow leading-underscore names in arguments
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Return types are inferred from TypeScript — no need to mandate them
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Warn on `any` — not an error so utility code can use it sparingly
      '@typescript-eslint/no-explicit-any': 'warn',
      // Warn on non-null assertions (!) — often a sign of missing guard
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Enforce `import type` for type-only imports (keeps JS bundle clean)
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // ── 4. React + Next.js rules ───────────────────────────────────────────────
  // Spread the Next.js preset first, then override what we need to change.
  ...nextCoreWebVitals,
  {
    files: ['**/*.{js,mjs,ts,tsx,jsx}'],
    rules: {
      // Next.js with react-jsx transform doesn't need React in scope
      'react/react-in-jsx-scope': 'off',
      // TypeScript already enforces prop shapes — prop-types is redundant
      'react/prop-types':         'off',
      // Hook call-order violations are always a bug
      'react-hooks/rules-of-hooks':  'error',
      // Missing deps in useEffect/useCallback/useMemo cause stale closures
      'react-hooks/exhaustive-deps': 'warn',
      // Keep legacy compiler checks visible without blocking local cleanup builds.
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
    },
  },

  // ── 5. Test file overrides ─────────────────────────────────────────────────
  // Relax rules that are noisy or counterproductive in test contexts.
  {
    files: ['tests/**/*.{ts,tsx,js,mjs}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      // `any` is fine in mock fixtures and test utilities
      '@typescript-eslint/no-explicit-any': 'off',
      // Assertion logs, debug output etc. are fine in tests
      'no-console': 'off',
    },
  },

]

export default config
