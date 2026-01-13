// Learn more https://docs.expo.io/guides/customizing-metro

// Polyfill for Array.toReversed() for older Node.js versions
require('core-js/actual/array/to-reversed');

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports for @google/genai
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
