const Path = require('path');
const Merge = require('webpack-merge');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./base.config');


module.exports = Merge(base, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin('../dist'),
        new UglifyJsPlugin({
            sourceMap: false,
        }),
        new Webpack.LoaderOptionsPlugin({
            minimize: true,
        }),   
    ] 
});

