var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// flexbox
loaders.push({
	test: /\.css$/,
  loader: 'style!css?modules',
  include: /flexboxgrid/,
});

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});
// global css files
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css'),
	exclude: /flexboxgrid/,
});

module.exports = {
	entry: [
		'./src/index.jsx'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'ccsi_inventory.js',
		library: 'ccsiInventory',
		libraryTarget: 'umd',
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('ccsi_inventory.css', {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: './src/template.html',
			title: 'Webpack App'
		})
	]
};
