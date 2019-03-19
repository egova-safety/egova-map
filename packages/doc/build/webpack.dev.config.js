const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackBaseConfig = require("./webpack.base.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const PreloadPlugin = require("preload-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //Webpack包文件分析器
function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = webpackMerge(webpackBaseConfig, {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        // main: "./src/main.ts",
        app: [
            './src/main.ts'
        ],
        vendors: ["vue", "vue-router", "flagwind-core", "@egova/flagwind-web", "iview", "@egova/map-base", "@egova/map-ui"]
    },
    resolve: {
        alias: {
            "@": resolve("src"),
            "src": resolve("src"),
            "views": resolve("src/views")
        }
    },
    output: {
        path: path.join(__dirname, "../dist"),
        publicPath: "",
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        globalObject: 'this'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin({
            additionalTransformers: [
                function () {
                    /* omitted long function */
                }
            ],
            additionalFormatters: [
                function () {
                    /* omitted long function */
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].css'
        }),
        /* config.plugin('hmr') */
        // new webpack.HotModuleReplacementPlugin(),
        /* config.plugin('progress') */
        // new webpack.ProgressPlugin(),
        /* config.plugin('html') */
        new HtmlWebpackPlugin({
            inject: true,
            filename: path.join(__dirname, "../dist/index.html"),
            template: path.join(__dirname, "../public/index.html"),
            minify: {
                removeComments: true,
                collapseWhitespace: false,
                removeAttributeQuotes: false
            }
        }),
        /* config.plugin('copy') */
        new CopyWebpackPlugin(
            [{
                from: path.resolve(__dirname, "../public"),
                to: path.resolve(__dirname, "../dist"),

                toType: 'dir',
                ignore: [
                    ".*"
                ]
            }]
        ),
        new BundleAnalyzerPlugin()
    ]
});
