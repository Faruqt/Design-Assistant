const TerserPlugin = require("terser-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  // If we're in production mode, prepare for minimization.
  // Note: Some libraries dont play well in non-minimized mode.
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "inline-source-map",
    entry: {
      ui: "./src/ui.tsx",
      code: "./src/code.ts",
    },
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        react: path.resolve("./node_modules/react"),
      },
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new webpack.DefinePlugin({
        global: {},
      }),
      new HtmlWebpackPlugin({
        inject: "body",
        template: "./src/ui.html",
        filename: "ui.html",
        chunks: ["ui"],
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: isProduction ? true : false,
            compress: isProduction ? true : false,

            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  };
};
