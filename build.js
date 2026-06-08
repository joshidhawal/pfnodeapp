import esbuild from "esbuild";
import path from "path";
import { builtinModules } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
// Define __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nodeVersion = process.version.split(".")[0]; // Get major version e.g., "v16" or "v18"
// const { builtinModules } = require("module"); // Import built-in modules from Node.js

// Get the list of Node.js built-in modules (dynamically)
const externalNodeModules = builtinModules.map((module) => `node:${module}`);

// Read package.json dynamically
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
);

// Get dependencies and devDependencies from package.json
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
  ...externalNodeModules,
};

// Generate external flag for each dependency in node_modules
const externalModules = Object.keys(dependencies);

esbuild
  .build({
    entryPoints: ["./dist/app.js"], // Output from TypeScript compilation
    outfile: "./dist/appBundle.js", // Final bundled file
    bundle: true, // Bundle all files into one
    platform: "node", // Node.js environment
    // target: "node14", // Target Node.js 14
    target: `node${nodeVersion}`, // Dynamically target the current Node version
    minify: true, // Minify the output for production
    sourcemap: true, // Generate source maps for debugging
    target: "esnext", // For the latest ECMAScript standard
    external: externalModules, // Don't bundle Node.js core modules
    format: "esm", // Set output to ESM format
  })
  .catch(() => process.exit(1));
