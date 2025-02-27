const path = require('path');
const envConfig = require('./envConfig');

envConfig();

module.exports = {
  devServer: {
    port: process.env.VUE_APP_PORT || 8080,
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/_variables.scss";
        `,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'), // Ejemplo de alias
        // Agrega más alias si es necesario
      },
    },
  },
};