const path = require("path");
const webpack = require("webpack"); // for the banner plugin
const userscriptInfo = require("./package.json");

module.exports = {
  entry: "./src/index.ts",
  mode: "none",
  target: "node",
  output: {
    filename: "./MRP-restaurant-manager.user.js",
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  plugins: [
    new webpack.BannerPlugin({
      raw: true,
      banner: `// ==UserScript==
                     // @name         Medium Rare Potato restaurant management script
                     // @description  Script made to manage your restaurant in https://game.medium-rare-potato.io/
                     // @namespace    https://github.com/Splash-07/MRP-script
                     // @version      ${userscriptInfo.version}
                     // @author       ${userscriptInfo.author}
                     // @match        https://game.medium-rare-potato.io/*
                     // ==/UserScript==`,
    }),
  ],
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "src"),
        loader: "ts-loader",
      },
    ],
  },
};
