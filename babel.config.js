module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Disabled: Reanimated Babel plugin has version incompatibility
      // Library still works at runtime without this optimization
      // [
      //   "react-native-reanimated/plugin",
      //   {
      //     relativeParentPath: "../../../",
      //   },
      // ],
    ],
  };
};
