// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintPluginTestingLibrary = require('eslint-plugin-testing-library');
const globals = require('globals');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)',
      'src/test-utils/**/*.[jt]s?(x)',
      'jest.setup.ts',
    ],
    // eslint-plugin-testing-library exposes no `flat/react-native` config;
    // `flat/react` is the correct and only choice for RNTL.
    extends: [eslintPluginTestingLibrary.configs['flat/react']],
    languageOptions: {
      // eslint-config-expo/flat only ships globals.browser.
      globals: { ...globals.jest },
    },
    rules: {
      // DOM-only concepts: RNTL has no `container`, and element.parent /
      // element.children are its supported traversal API.
      'testing-library/no-container': 'off',
      'testing-library/no-node-access': 'off',
      // RNTL 14 made fireEvent (and render, renderHook, rerender, unmount)
      // async - they all return Promises now. eslint-plugin-testing-library
      // still models fireEvent as sync, so this rule fires on correct code.
      'testing-library/no-await-sync-events': 'off',
    },
  },
  {
    // jest.mock factories are hoisted above imports, so they must use require()
    // to resolve the replacement module lazily. ESM import is not an option.
    files: ['jest.setup.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    files: ['*.config.js', 'jest/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    ignores: ['dist/*', 'coverage/*'],
  },
]);
