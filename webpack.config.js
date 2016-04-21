var webpack = require("webpack");

var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: ['./src/js/app.js']
    },
    output: {
        path: require('path').resolve('build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
              test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
              loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
              test: /\.(png|jpg)$/,
              loader: 'file?hash=sha512&digest=hex&name=[hash].[ext]'
            }
        ]
    },
    plugins: [
      new ExtractTextPlugin("[name].css"),
    ]
};
