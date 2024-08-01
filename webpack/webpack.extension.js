const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    contentScript: './src/extension/contentScript.js',
    injected: './src/extension/injected.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist/extension'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/extension/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
});
