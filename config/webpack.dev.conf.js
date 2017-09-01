let merge = require('webpack-merge')
let webpackBaseConfig = require('./webpack.base.conf')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

let webpack = require('webpack')


// add hot-reload related code to entry chunks
Object.keys(webpackBaseConfig.entry).forEach(function (name) {
    webpackBaseConfig.entry[name] = ['./build/dev-client'].concat(webpackBaseConfig.entry[name])
})

module.exports = merge(webpackBaseConfig, {
    plugins:[
        new webpack.DefinePlugin({
           'process.env': { NODE_ENV: '"development"' }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './template/index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]
})