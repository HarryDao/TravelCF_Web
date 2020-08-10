const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PUBLIC_PATH = require('../configs/app').PUBLIC_PATH || '/';

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: Path.resolve(__dirname, '../dist'),
        publicPath: PUBLIC_PATH,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' },
                ]
            },
            {
                test: /\.(png|jp(e*)g|gif|mp4)$/,
                loader: 'file-loader',
                options: {
                    publicPath: PUBLIC_PATH
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.html'
        }), 
    ]
}