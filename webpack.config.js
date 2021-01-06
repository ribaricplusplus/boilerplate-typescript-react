const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
  mode: 'production',
  entry: [
    './build/src/main.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: "main.[contenthash:8].js"
  },
  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:8].[ext]',
            },
          },
          {
            // Makes it possible to import css files in javascript
            test: cssRegex,
            exclude: cssModuleRegex,
            use: ['style-loader', 'css-loader']
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: ['style-loader', {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            }, 'sass-loader']
          },
          {
            loader: 'file-loader',
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: '[name].[hash:8].[ext]',
            },
          }
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ]
      }
    ]
  },
};