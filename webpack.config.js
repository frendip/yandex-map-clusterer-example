const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
    clean: true
  },
  devServer: {
    allowedHosts: 'all'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html')
    })
  ],
  externals: {
    ymaps3: [
      `promise new Promise((resolve) => {
		  if (typeof ymaps3 !== 'undefined') {
			return ymaps3.ready.then(() => resolve(ymaps3));
		  }
		  const script = document.createElement('script');
		  script.src = "https://api-maps.yandex.ru/v3/?apikey=532d0789-5980-41fc-862e-9bd83d917e65&lang=ru_RU";
		  script.onload = () => {
			ymaps3.ready.then(() => resolve(ymaps3));
		  };
		  document.head.appendChild(script);
		})`
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: ['/node_modules/']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 5000,
    open: true
  }
};
