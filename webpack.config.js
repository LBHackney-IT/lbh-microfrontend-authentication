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
        plugins: [
            new webpack.EnvironmentPlugin({
                AUTH_ALLOWED_GROUPS: dotenv.AUTH_ALLOWED_GROUPS || '',
                AUTH_DOMAIN: dotenv.AUTHDOMAIN || '',
                COOKIE_DOMAIN: dotenv.COOKIE_DOMAIN || '',
                AUTH_TOKEN_NAME: dotenv.AUTH_TOKEN_NAME || '',
            }),
        ],
    });
};
