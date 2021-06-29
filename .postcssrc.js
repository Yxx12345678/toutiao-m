module.exports = {
  plugins: {
    // 配置使用autoprefixer添加不同浏览器前缀，因为vuecli自带，所以注释掉
    // 'autoprefixer': {
    // 配置浏览器的兼容信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 作用：把px转为rem
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 要配置的属性，全部属性，例如height,width
      propList: ['*']

      // 配置不要的转换资源
      // exclude: 'github-markdown'
    }
  }
}
