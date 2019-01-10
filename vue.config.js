const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  publicPath: '/blog',

  chainWebpack: webpackConfig => {
    webpackConfig.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
}