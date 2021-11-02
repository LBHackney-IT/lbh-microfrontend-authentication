const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const webpack = require('webpack');
const dotenv = require('dotenv').config();

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'mtfh',
        projectName: 'auth',
        webpackConfigEnv,
        argv,
    });
    return merge(defaultConfig, {
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: 'file-loader',
                },
                {
                    test: /\.scss$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        externals: ['react-router-dom'],
    });
};
