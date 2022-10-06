const path = require("path");

module.exports = [
  // CLIENT
  {
    devtool: "inline-source-map",
    mode: "development",
    entry: [
      "./app/src/ts/index.ts",
      "./app/src/ts/scripts/footer/onglets.ts",
      "./app/src/ts/scripts/footer/planning.ts",
    ],
    output: {
      publicPath: "app/public",
      filename: "bundle.js",
      path: path.resolve(__dirname, "./app/public"),
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "app/public"),
      },
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          include: path.resolve(__dirname, "app/src"),
        },
      ],
    },
  },
  {
    entry: "./app/src/styles/global.scss",
    mode: "development",
    output: {
      // This is necessary for webpack to compile
      // But we never use style-bundle.js
      path: path.resolve(__dirname, "./app/public"),
      filename: "style-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                path: "app/public",
                name: "bundle.css",
              },
            },
            { loader: "extract-loader" },
            { loader: "css-loader" },
            {
              loader: "sass-loader",
              options: {
                // Prefer Dart Sass
                implementation: require("sass"),

                // See https://github.com/webpack-contrib/sass-loader/issues/804
                webpackImporter: false,
                sassOptions: {
                  includePaths: ["./node_modules"],
                },
              },
            },
          ],
        },
      ],
    },
  },
];
