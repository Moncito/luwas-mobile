const fs = require("fs");
const path = require("path");

const pluginPath = path.join(
  __dirname,
  "node_modules/react-native-reanimated/plugin/index.js",
);

const content = fs.readFileSync(pluginPath, "utf8");

// Replace all instances of state.opts with a safe check
const fixed = content.replace(/\bstate\.opts\b/g, "(state?.opts || {})");

if (fixed !== content) {
  fs.writeFileSync(pluginPath, fixed, "utf8");
  console.log("✅ Successfully patched reanimated plugin!");
} else {
  console.log("⚠️ Pattern not found or already patched");
}
