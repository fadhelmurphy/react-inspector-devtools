const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/embed/index.js',
  output: {
    filename: 'embed.bundle.js',
    path: path.resolve(__dirname, '../dist/embed'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/embed/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist/embed'),
    },
    compress: true,
    port: 9000,
    open: true,
  },
});
