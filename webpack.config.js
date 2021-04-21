const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const webpack = require('webpack');

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
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/'),
                stream: require.resolve('stream-browserify'),
                crypto: require.resolve('crypto-browserify'),
                util: require.resolve('util/'),
            },
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
        ],
    });
};
