const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    client: {
      overlay: {
        warnings: false,
        runtimeErrors: false
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss";`,
        sassOptions: {
          silenceDeprecations: ['legacy-js-api', 'import']
        }
      }
    }
  }
})
