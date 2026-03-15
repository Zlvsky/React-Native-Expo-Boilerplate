// Simplified ESLint configuration for React Native + Expo + React Compiler + NativeWind
const js = require('@eslint/js');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const reactCompiler = require('eslint-plugin-react-compiler')

module.exports = [
  // Base configurations
  js.configs.recommended,
  ...expoConfig,
  ...tseslint.configs.recommended,
  reactCompiler.configs.recommended,
  
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: 'readonly',
        global: 'readonly',
      },
    },
    
    plugins: {
      'react': require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'react-native': require('eslint-plugin-react-native'),
      // 'react-compiler': require('eslint-plugin-react-compiler'),
    },
    
    settings: {
      react: {
        version: 'detect',
      },
    },
    
    rules: {
      // React Rules - Essential only
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-unknown-property': ['error', {
        ignore: ['className', 'tw'] // Allow NativeWind
      }],
      
      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off', // Too noisy, developers can manage dependencies
      
      // React Native Rules - Relaxed
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'off', // Allow for flexibility
      'react-native/no-color-literals': 'off',
      'react-native/no-raw-text': 'off',
      
      // TypeScript Rules - Practical
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars for flexibility
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for flexibility
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow ! operator
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off', // Allow ts-ignore
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      
      // General Rules - Essential only
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version
      'no-undef': 'off', // TypeScript handles this
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-case-declarations': 'off',
      'no-duplicate-imports': 'warn',
      'no-return-await': 'off',
      'no-extra-boolean-cast': 'off', // Allow double negation for clarity
      
      // Style Rules - Minimal
      'eqeqeq': 'off', // Allow == comparisons
      'curly': 'off',
      'brace-style': 'off',
      'object-curly-spacing': ['error', 'always'],
      
      // Complexity Rules - Off (too restrictive)
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'complexity': 'off',
      'no-nested-ternary': 'off',
      
      // Import Rules
      'import/no-duplicates': 'warn',
      'import/order': 'off', // Too annoying for development
      
      // React Compiler - Essential
      // 'react-compiler/react-compiler': 'warn', // Warn instead of error
    },
  },
  
  // Test files - Very relaxed
  {
    files: ['**/__tests__/**/*', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-native/no-inline-styles': 'off',
    },
  },
  
  // Config files - Very relaxed
  {
    files: ['*.config.{js,ts}', '*.setup.{js,ts}', 'babel.config.js', 'metro.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
      'import/no-dynamic-require': 'off',
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.expo/**',
      'ios/**',
      'android/**',
      'web-build/**',
      'coverage/**',
      '*.generated.*',
    ],
  },
];
