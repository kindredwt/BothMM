var path = require("path");
var webpack = require("webpack");

var MINIFY = JSON.parse(process.env.MINIFY || false);

var X = module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: "build/BothMM",
        library: "BothMM",
        libraryTarget: "var"
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, "src"),
                loader: "babel-loader"
            }
        ]
    },
    devtool: "source-map",
    plugins: []
};

if (MINIFY) {
    X.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    X.output.filename += '-min';
}
X.output.filename += '.js';
