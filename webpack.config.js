const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: [
    './src/main.tsx'
  ],
  output: {
    path: process.env.NODE_ENV === 'development' ?
      join(__dirname, 'build') :
      join(__dirname, 'dist'),
    filename: "main.[contenthash:8].js"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    contentBase: join(__dirname, 'build'),
    contentBasePublicPath: '/',
    port: 8000,
    watchContentBase: true,
    writeToDisk: true,
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Document',
      template: 'index.html',
      filename: 'index.html'
    })
  ],
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: join(__dirname, 'tsconfig.release.json')
              }
            }
          },
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
