
const webpack = require("webpack");
const merge = require("webpack-merge");


const webpackBaseConfig = require("./webpack.base.config");

module.exports = merge(webpackBaseConfig, {
    mode: 'development',
    output: {
        filename: "index.umd.js",
        library: "flagwind-map-ui"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        })
    ]
});