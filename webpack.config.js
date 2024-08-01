const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',
    entry: {
      main: './src/index.js',
      popup: './src/popup.js',
      contentScript: './src/contentScript.js',
      background: './src/background.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library: '[name]',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['main'],
        filename: 'index.html'
      }),
      new HtmlWebpackPlugin({
        template: './src/popup.html',
        chunks: ['popup'],
        filename: 'popup.html'
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      open: true,
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
  };
};
