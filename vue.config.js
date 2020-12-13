module.exports = {
  publicPath: '/edu-boss-fed',
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/front': {
        target: 'http://edufront.lagou.com',
        changeOrigin: true
      },
      '/boss': {
        target: 'http://eduboss.lagou.com',
        changeOrigin: true
      }
    }
  }
}
