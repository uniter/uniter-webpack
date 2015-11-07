module.exports = {
  context: __dirname,
  entry: './app/index.js',
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  output: {
    path: 'dist/',
    filename: 'bundle.js'
  }
};
