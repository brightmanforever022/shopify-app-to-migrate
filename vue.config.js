module.exports = {
  configureWebpack: {
    output: {
      filename: 'app.js'
    },
    optimization: {
      splitChunks: false
    }
  },
  filenameHashing: false,
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "~@/styles/style.scss";`
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://display4sale-order-app.herokuapp.com',
        ws: false
      }
    }
  },
  assetsDir: 'assets',
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = "./public/frontend.html"
        return args
      })

    // config
    //   .plugin('provide')
    //   .use(require('webpack').ProvidePlugin, [{
    //     $: 'jquery',
    //     jquery: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery'
    //   }])

    config.resolve.symlinks(false)
  }
}
