// Pin the timezone before Jest boots. This file is evaluated in the parent
// process and workers inherit process.env, so date-fns `format()` is
// deterministic across dev machines and CI.
process.env.TZ = 'UTC';

/**
 * Preset merge semantics (jest-config@29 `setupPreset`):
 *   setupFiles / setupFilesAfterEnv -> CONCATENATED with the preset's
 *   moduleNameMapper / transform    -> MERGED, ours wins and lands first
 *   everything else                 -> WHOLESALE REPLACED
 * That is why transformIgnorePatterns and testPathIgnorePatterns below restate
 * jest-expo's own entries verbatim.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  // Single-platform native preset. Not bare `jest-expo`: that inherits Jest's
  // default moduleFileExtensions with no ios.*/native.* entries, so React
  // Native's own `Platform.ios.js` internals fail to resolve. Not
  // `jest-expo/universal` either: that runs every test 4x and needs a divergent
  // mock set for its jsdom/react-native-web projects.
  preset: 'jest-expo/ios',

  roots: ['<rootDir>/src'],

  // Do NOT override testMatch - the preset generates 9 patterns including the
  // .ios. / .native. suffixed variants.

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',

    // src/global.css is imported by src/app/_layout.tsx and src/constants/theme.ts.
    '\\.css$': '<rootDir>/jest/style-mock.js',

    // lucide-react-native's `react-native` export condition points at
    // dist/esm/*.mjs. The preset's transform key is `\.[jt]sx?$`, which does not
    // match .mjs, so transformIgnorePatterns cannot fix this. Force the CJS barrel.
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
    '^lucide-react-native/icons/(.*)$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/icons/$1.js',
  },

  // REPLACES the preset's array. The first pattern's negative lookahead has NO
  // trailing slash on purpose: `react-native` therefore also matches
  // react-native-css / -reanimated / -gesture-handler / -svg /
  // -safe-area-context / -keyboard-controller / -worklets / -screens, and
  // `expo` matches every expo-* package. Do not "tidy" it by adding a slash.
  transformIgnorePatterns: [
    '/node_modules/(?!(' +
      '.pnpm|react-native|@react-native|@react-native-community|' +
      'expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|' +
      '@sentry/react-native|native-base|standard-navigation' +
      // --- added for this app ---
      '|@gluestack-ui' + // ESM main, and subpaths like button/creator.ts are raw TS
      '|@legendapp' + // index.js is `export * from './lib/commonjs/index.js'`
      '|react-redux' + // `react-native` condition -> dist/react-redux.legacy-esm.js
      '|immer' + // `react-native` condition -> dist/immer.legacy-esm.js
      '))',
    // Prevents "Reentrant plugin detected trying to load react-native-reanimated/plugin"
    '/node_modules/react-native-reanimated/plugin/',
    // The RN babel preset is part of the transformer itself
    '/node_modules/@react-native/babel-preset/',
  ],

  // REPLACES the preset's ['/node_modules/', '/__rsc_tests__/'].
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__rsc_tests__/',
    // Dead code: imports @gorhom/bottom-sheet, @legendapp/list,
    // react-native-markdown-display, expo-image-picker and expo-document-picker,
    // none of which are installed. Nothing outside these dirs imports them.
    '<rootDir>/src/components/ui/chat-ai/',
    '<rootDir>/src/components/ui/bottomsheet/',
  ],

  clearMocks: true, // mockClear() before each test: wipes call history, KEEPS impls
  restoreMocks: true, // restoreAllMocks(): jest.spyOn / replaceProperty only
  // resetMocks must stay FALSE. Under Jest 29 mockReset() strips implementations,
  // which would gut jest-expo's `jest.fn(impl)` native-module mocks and the
  // expo-crypto / keyboard-controller mocks in jest.setup.ts.

  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/types/**'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/components/ui/', // generated gluestack-ui kit, not our code
    '<rootDir>/src/app/', // expo-router route files: thin re-exports
    '<rootDir>/src/test-utils/',
  ],
  coverageReporters: ['text-summary', 'lcov'],
  // No coverageThreshold on a greenfield repo. Let the number stabilise, then ratchet.
};
