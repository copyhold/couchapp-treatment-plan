var webpack = require('webpack')
var config = {
  entry: { 
    script: './src/js/main.js',
    vendor: ['moment','jquery']
  },
  output: {
    path: './couchapp/_attachments/js',
    filename: '[name].js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: 'cheap-eval-source-map',
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules|__test__/,
      loader: 'babel-loader',
      query: {
        "presets": ["es2015","react"]
      }
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'const': "1"
    })
  ]
}


if (0) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        sequences     : true,
        booleans      : true,
        loops         : true,
        unused      : true,
        warnings    : false,
        drop_console: true,
        unsafe      : true
      }
    })
  )
}

module.exports = config

