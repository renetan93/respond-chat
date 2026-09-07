# Testing

Jest + [React Native Testing Library](https://callstack.github.io/react-native-testing-library/), on Expo SDK 57 / RN 0.86 / React 19.

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage
npm run test:ci       # what CI runs
```

## Writing tests

**RNTL 14 is fully async.** `render`, `renderHook`, `fireEvent`, `rerender` and
`unmount` all return Promises. Forgetting an `await` gives you the confusing
"`render` function has not been called" error from `screen`, because the render
has not committed yet.

```tsx
it('does the thing', async () => {
  await renderWithProviders(<Thing />);
  await fireEvent.press(screen.getByLabelText('Send message'));
  expect(onSubmit).toHaveBeenCalled();
});
```

Use `renderWithProviders` / `renderHookWithProviders` from `@/test-utils` for
anything touching redux, React Query or safe-area insets. Each call gets a fresh
store and a fresh QueryClient, so no state leaks between tests.

**Never assert on Tailwind/NativeWind styles.** Jest does not run Metro's CSS
pipeline, so `className` resolves to no styles and `toHaveStyle()` will fail
against Tailwind classes. Assert on text, accessibility labels, testIDs and
behaviour. Inline `StyleSheet.create` styles do still work.

## How the config is put together

| File | Purpose |
| --- | --- |
| `jest.config.js` | Preset, module mapping, transform allow-list |
| `jest.setup.ts` | Native module mocks, env vars, RNTL config |
| `jest/style-mock.js` | Stub for `import '@/global.css'` |
| `src/test-utils/index.tsx` | `renderWithProviders` and friends |

### Preset: `jest-expo/ios`

One run per test, iOS/native resolution. Two alternatives were rejected:

- **Bare `jest-expo`** is broken for an app: it inherits Jest's default
  `moduleFileExtensions` with no `ios.*` / `native.*` entries, so React Native's
  own `Platform.ios.js` internals fail to resolve.
- **`jest-expo/universal`** runs every test four times (ios/android/web/node)
  and needs a divergent mock set for its jsdom + react-native-web projects.

To add web coverage later, add a second project rather than switching preset:

```js
module.exports = { projects: [require('./jest.native.config'), require('./jest.web.config')] };
```

### Preset merge semantics

Jest concatenates `setupFiles` and `setupFilesAfterEnv` with the preset's,
merges `moduleNameMapper` and `transform`, and **wholesale replaces everything
else**. That is why `transformIgnorePatterns` and `testPathIgnorePatterns` in
`jest.config.js` restate jest-expo's own entries verbatim — dropping them
breaks the RN transform.

### Why each transformIgnorePatterns addition exists

jest-expo's default allow-list already covers `react-native*`, `expo*` and
`@react-native*`. These four ship ESM under the conditions Jest resolves with
and had to be added:

| Package | What it serves |
| --- | --- |
| `@gluestack-ui` | ESM main; subpaths like `button/creator.ts` are raw TypeScript |
| `@legendapp` | `index.js` is `export * from './lib/commonjs/index.js'` |
| `react-redux` | `react-native` condition → `dist/react-redux.legacy-esm.js` |
| `immer` | `react-native` condition → `dist/immer.legacy-esm.js` (via RTK) |

`lucide-react-native` has the same problem but cannot be fixed this way: its
`react-native` condition serves `.mjs`, which the preset's `\.[jt]sx?$`
transform key does not match. It is remapped to the CJS barrel in
`moduleNameMapper` instead.

### Gotchas hit while setting this up

- **`react-native-worklets` must be mocked before Reanimated.** Under
  `jest-expo/ios` the `native.*` extensions make `NativeWorklets.native.ts` win
  over the plain `.js` stub, and its module-scope `loadUnpackers()` throws on the
  absent TurboModule.
- **React Query keeps a separate 5-minute `gcTime` for mutations.** That
  `setTimeout` is an open handle that stops Jest exiting after a mutation test,
  so `makeTestQueryClient` sets `gcTime: Infinity` on mutations as well as
  queries.
- **`expo-crypto`'s stock mock returns `undefined` from `randomUUID()`**, which
  would make `post.tempId === undefined` match every non-optimistic post in
  `useCreatePost`. `jest.setup.ts` replaces it with a deterministic counter that
  resets each test.
- **`eslint-plugin-testing-library` has no `flat/react-native` config**, and its
  `no-await-sync-events` rule predates RNTL 14's async `fireEvent`, so that rule
  is disabled in `eslint.config.js`.
- **`@types/jest` is not picked up automatically** under this TS setup; it is
  pulled in by the `/// <reference types="jest" />` in `jest-env.d.ts`.

### Excluded from test runs

`src/components/ui/chat-ai/` and `src/components/ui/bottomsheet/` are dead code
— they import `@gorhom/bottom-sheet`, `@legendapp/list`,
`react-native-markdown-display`, `expo-image-picker` and `expo-document-picker`,
none of which are installed, and nothing else in the app imports them.
