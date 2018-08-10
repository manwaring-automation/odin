const path = require('path');
const slsw = require('serverless-webpack');

const entries = {};

Object.keys(slsw.lib.entries).forEach(key => (entries[key] = ['./source-map-install.js', slsw.lib.entries[key]]));

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: entries,
  externals: { 'aws-sdk': 'aws-sdk' },
  devtool: 'source-map',
  resolve: { extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'] },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  stats: 'errors-only',
  target: 'node',
  module: {
    // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  }
};
