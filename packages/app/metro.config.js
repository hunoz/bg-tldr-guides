const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const chokidar = require('chokidar');
const { generate: generateRegistry } = require('./scripts/generate-registry');
const { generate: generateThemeMap } = require('./scripts/generate-theme-map');

// Run all generators on Metro startup
require('./scripts/generate-all');

const config = getDefaultConfig(__dirname);

// Watch games directory for changes and regenerate
const gamesDir = path.resolve(__dirname, 'games');
chokidar
    .watch('*/config.ts', { cwd: gamesDir, ignoreInitial: true })
    .on('all', () => generateRegistry());
chokidar
    .watch('*/theme.ts', { cwd: gamesDir, ignoreInitial: true })
    .on('all', () => generateThemeMap());

// Enable SVG imports as React components via react-native-svg-transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;
