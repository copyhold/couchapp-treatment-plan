var webpack = require('webpack')
var isProd = process.env.NODE_ENV==='production'
var config = {
  entry: { 
    script: './src/js/main.js',
    vendor: ['moment','jquery','immutable','redux','react-redux','react-select']
  },
  output: {
    path: './couchapp/_attachments/js',
    filename: '[name].js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: isProd ? 'cheap-eval' : 'eval',
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
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|il|ru)$/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
        //'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'isProd': isProd
    })
  ]
}


if (isProd) {
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

