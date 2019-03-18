const path = require("path");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackBaseConfig = require("./webpack.base.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");


function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = webpackMerge(webpackBaseConfig, {
    entry: {
        main: "./src/main.ts",
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
        chunkFilename: "[name].chunk.js"
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
        )
    ]
});
