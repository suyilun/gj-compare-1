/**
 * 默认使用蚂蚁金服 antd组件，如果不需要antd的话，就需要修改js的loader
 * @type {webpack}
 */
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ENV = JSON.stringify(require("./Env/env"));
var ENVPlugin = new webpack.DefinePlugin({__ENV__: ENV});

const config = {
    //devtool: 'source-map',//编译速度会慢
    //devtool:"cheap-eval-source-map",
    entry: {
        app: [
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
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        //new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt'),//统计打包文件插件
        new HtmlWebpackPlugin({
            template: './App/index.html'
        }),
        new LodashModuleReplacementPlugin,
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        ENVPlugin,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
    ],

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
                },
              
            ],  'lodash'
        ],
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