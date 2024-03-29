const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  demo: {
    mode: "development",
    entry: "./examples/demo/main.js",
    resolve: {
      alias: {},
      fallback: {
        "crypto": require.resolve("crypto-browserify"), 
        "util": require.resolve("util/"),
        "os": require.resolve("os-browserify/browser"),
        "buffer": require.resolve("buffer/"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "fs": false,
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "url": require.resolve("url/"),
        "process": require.resolve("process/")
      },
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
          loader: "file-loader",
          options: {
              outputPath: "assets",
            }
          }
        ]
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "assets",
              }
            }
          ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {loader: "style-loader"}, 
            {loader: "css-loader"}, 
          ]
        },
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/react"]
            }
          } 
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({inject: "head", title: "Winston Transport Demo"}),
      
      new webpack.ProvidePlugin({ 
        process: 'process/browser', 
        Buffer: ['buffer', 'Buffer'] 
      })],
    output: {
      path: path.resolve(__dirname, "examples/demo/dist",),
      filename: "bundle.js"
    }
  }
}
