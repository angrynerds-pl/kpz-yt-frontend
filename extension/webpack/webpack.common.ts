import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { Configuration } from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin';
import Dotenv from 'dotenv-webpack';

const srcDir = '../src/';
const config: Configuration = {
  entry: {
    popup: path.join(
      __dirname,
      srcDir + 'popup.ts'
    ),
    background: path.join(
      __dirname,
      srcDir + 'background.ts'
    ),
    contentScript: path.join(
      __dirname,
      srcDir + 'contentScript.ts'
    )
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new CopyPlugin([{ from: '.', to: '../' }], {
      context: path.join(__dirname, '../public')
    }),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new Dotenv({
      path: './.env',
      safe: true
    })
  ]
};

export default config;
