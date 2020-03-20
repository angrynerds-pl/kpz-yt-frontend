import merge from 'webpack-merge';
import common from './webpack.common';
import webpack from 'webpack';

export default merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('http://localhost:3000')
    })
  ]
});
