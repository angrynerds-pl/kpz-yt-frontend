import merge from 'webpack-merge';
import common from './webpack.common';
import webpack from 'webpack';

export default merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('http://localhost:3000')
    })
  ]
});
