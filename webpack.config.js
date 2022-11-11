const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: `index.js`,
    path: path.resolve(__dirname, "dist"),
    globalObject: "this",
    library: {
      type: "umd",
      name: "wcagPalette"
    }
  },
};