/*
 * @Author: xuwei
 * @Date: 2020-08-29 12:09:47
 * @LastEditTime: 2020-09-03 23:01:03
 * @LastEditors: xuwei
 * @Description:
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "/dist",
    open: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: [path.resolve(__dirname, "src/component")],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
        include: [path.resolve(__dirname, "src/component")],
      },
      {
        test: /\.(ttf|eot|woff2|woff|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "iconfont",
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  mode: "production",
};
