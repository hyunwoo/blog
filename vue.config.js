const HtmlWebpackPlugin = require('html-webpack-plugin');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,
  transpileDependencies: [/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/],

  configureWebpack: {
    plugins: [
      // CKEditor needs its own plugin to be built using webpack.
      new CKEditorWebpackPlugin({
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'en'
      })
    ]
  },
  css: {
    loaderOptions: {
      // Various modules in the CKEditor source code import .css files.
      // These files must be transpiled using PostCSS in order to load properly.
      postcss: styles.getPostCssConfig({
        themeImporter: {
          themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
        },
        minify: true
      })
    }
  },
  chainWebpack: (webpackConfig) => {
    webpackConfig.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader');

    webpackConfig.module
      .rule('svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('file-loader')
      .loader('raw-loader');
  }
};
