// patch-reanimated.js
const fs = require("fs");
const path = require("path");

const pluginFile = path.resolve(
  __dirname,
  "node_modules/react-native-reanimated/plugin/index.js",
);

if (fs.existsSync(pluginFile)) {
  let content = fs.readFileSync(pluginFile, "utf8");
  // Guard against undefined state.opts
  if (!content.includes("state && state.opts")) {
    content = content.replace(
      /state\.opts/g,
      "state && state.opts ? state.opts : {}",
    );
    fs.writeFileSync(pluginFile, content, "utf8");
    console.log("✅ Patched react-native-reanimated/plugin.js successfully!");
  } else {
    console.log("⚙️ Reanimated plugin already patched.");
  }
} else {
  console.log("❌ Could not find react-native-reanimated plugin file.");
}
