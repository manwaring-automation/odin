module.exports = {
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining'],
  presets: [['@babel/preset-env', { targets: { node: 12 } }], '@babel/preset-typescript']
};
