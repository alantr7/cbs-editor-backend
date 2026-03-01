const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/app.ts', // Entry point,
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js', // Output filename
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    target: "node",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    mode: 'development', // Can be 'production' or 'development'
};