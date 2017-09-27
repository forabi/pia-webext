const path = require('path');
const webpack = require('webpack');
const manifest = require('./dist/manifest.json');
const WebpackHTMLPlugin = require('html-webpack-plugin');

const excludedPatterns = [path.resolve(__dirname, '../dist'), /node_modules/];

module.exports = {
  entry: {
    ui: path.resolve(__dirname, 'src/ui/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/index.js',
  },
  devServer: {
    port: 8080,
    inline: true,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      // Replace lodash with lodash-es for better tree shaking
      lodash: 'lodash-es',
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'react-redux': 'preact-redux',
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.t|jsx?$/,
        exclude: excludedPatterns,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([/node_modules/, /dist/]),
    new webpack.NoEmitOnErrorsPlugin(),
    // Environment
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // HTML index
    new WebpackHTMLPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/ui/index.html'),
      inject: 'body',
      minify: false,
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   comments: false,
    //   sourceMap: true,
    // }),
    // Banner
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: `${manifest.name} hash:[hash], chunkhash:[chunkhash], name:[name]`,
    }),
  ],
};
