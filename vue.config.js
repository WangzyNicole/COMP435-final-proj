module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // csv-loader
    config.module
      .rule('csv-loader')
      .test(/\.csv$/)
      .use('csv-loader')
        .loader('csv-loader')
        .end()
  }
}