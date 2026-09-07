module.exports = function (api) {
  api.cache(true);

  return {
    // require.resolve pins the CommonJS build. Metro already picks that one, so
    // this is a no-op for the app - but Jest's coverage pass instruments
    // untested files from a plain Node context that would otherwise resolve the
    // ESM build (dist/module/babel.js) and die on `require is not defined`.
    presets: [['babel-preset-expo'], require.resolve('nativewind/babel')],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './src',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
