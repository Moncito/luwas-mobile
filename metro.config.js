// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  alias: {
    "firebase/auth/react-native": "firebase/auth", // ✅ redirect to web version
  },
};

module.exports = config;
