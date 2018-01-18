const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/css/main.scss',
    './src/js/main.js'
  ],

  output: {
    path: __dirname + '/public_html/assets/compiled',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract(['css-loader?url=false', 'sass-loader'])
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader?extractCSS=true'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]
};
