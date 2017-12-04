/**
 * 默认使用蚂蚁金服 antd组件，如果不需要antd的话，就需要修改js的loader
 * @type {webpack}
 */
const webpack = require('webpack');
const path = require('path');
// const {resolve} = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ENV = JSON.stringify(require("./Env/env"));
var ENVPlugin = new webpack.DefinePlugin({__ENV__: ENV});
const config = {
    devtool: 'source-map',//编译速度会慢
    //devtool:"cheap-eval-source-map",
    entry: {
        app: [
            'react-hot-loader/patch',
            'webpack/hot/only-dev-server',
            './App/index.js'],//'babel-polyfill', 
    },
    // watch: true,
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        //new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': ENV.profile }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt'),//统计打包文件插件
        new HtmlWebpackPlugin({
            template: './App/index.html'
        }),
        ENVPlugin,
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         screw_ie8: true,
        //         warnings: false
        //     },
        //     mangle: {
        //         screw_ie8: true
        //     },
        //     output: {
        //         comments: false,
        //         screw_ie8: true
        //     }
        // }),
    ],
    devServer: {
        port: 8083,
        historyApiFallback: true, //404s fallback to ./index.html
        // hotOnly:true, 使用hotOnly和hot都可以
        hot: true,
        //stats: 'errors-only', //只在发生错误时输出
        contentBase: path.resolve(__dirname, 'build'),
        // host:process.env.Host, undefined
        // port:process.env.PORT, undefined
        overlay: { //当有编译错误或者警告的时候显示一个全屏overlay
            errors: true,
            warnings: true,
        },
        proxy: {
            '/fwzy/*': {
                host: 'localhost',
                target: 'http://localhost:8080/fwzy',
                secure: false,
                withCredentials: true,
                pathRewrite: {
                    '^/fwzy/': '',
                },
            },
        },
    },
    module: {
        loaders: [{
            test: /\.(css)$/,
            loader: 'style-loader!css-loader?sourceMap',
            // loaders: ['style-loader', 'css-loader', 'less-loader'],
        },
        {
            test: /\.(less)$/,
            loader: 'style-loader!css-loader!less-loader',
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'url-loader?limit=8192',
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)\w*/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
            test: /\.html$/,
            loader: "raw-loader" // loaders: ['raw-loader']，這個方式也是可以被接受的。
        },
        {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
            query: {
                compact: true,
                presets: ['es2015', 'stage-0', 'react'],
                plugins: [['import', {
                    libraryName: 'antd',
                    style: true, // or 'css'
                }], "react-hot-loader/babel"],
                //  'transform-runtime'
                //  plugins: [
                //   "transform-object-rest-spread",
                //   "transform-es2015-arrow-functions",
                //   "transform-object-assign",
                //   "es6-promise"
                // ]
            },
        }],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        _: 'lodash',
        antd: 'antd',
    },
};
module.exports = config;