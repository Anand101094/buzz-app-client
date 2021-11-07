const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool: "cheap-module-source-map",
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_module/,
                use: 'babel-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader', 'css-loader', 'sass-loader',
                ]
            },
            {
                test: /\.(gif|jpg|png|mp3|aac|ogg|wav)$/,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: "./public/_redirects", to: path.resolve(__dirname, 'dist')}
            ]
          }),
    ]
}