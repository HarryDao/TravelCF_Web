const Merge = require('webpack-merge');
const base = require('./base.config');
const { PORT } = require('../configs/app');
const port = PORT || 3000;

module.exports = Merge(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        // host: '172.20.10.2',
        host: 'localhost',
        port: port,
        historyApiFallback: true,
        disableHostCheck: true
    },
});