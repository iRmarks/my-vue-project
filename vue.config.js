const CompressionWebpackPlugin = require("compression-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";
const path = require("path");
const resolve = function(dir) {
  return path.join(__dirname, dir);
};

module.exports = {
  //部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  //当运行 vue-cli-service build 时生成的生产环境构建文件的目录
  outputDir: "dist",
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: "assets",
  // eslint-loader 是否在保存的时候检查 安装@vue/cli-plugin-eslint有效
  lintOnSave: true,
  //是否使用包含运行时编译器的 Vue 构建版本。设置true后你就可以在使用template
  runtimeCompiler: true,
  // 生产环境是否生成 sourceMap 文件 sourceMap的详解请看末尾
  productionSourceMap: true,
  css: {
    extract: isProd, // css分离,与HMR不兼容
    sourceMap: !isProd,
    loaderOptions: {
      sass: {
        // 引入全局样式
        prependData: '@import "@a/scss/frame.scss";'
      }
    },
    requireModuleExtension: true
  },
  chainWebpack: config => {
    config.resolve.symlinks(true); //热更新
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@a", resolve("src/assets"))
      .set("@v", resolve("src/views"))
      .set("@c", resolve("src/components"))
      .set("@u", resolve("src/utils"))
      .set("@s", resolve("src/service")); /* 别名配置 */
    config.optimization.runtimeChunk("single");
  },
  configureWebpack: config => {
    if (isProd) {
      // 把vuex，router，element等分离打包
      config.optimization = {
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vue: {
              name: "vue",
              test: /[\\/]node_modules[\\/]vue[\\/]/,
              priority: -10
            },
            vuex: {
              name: "vuex",
              test: /[\\/]node_modules[\\/]vuex[\\/]/,
              priority: -10
            },
            "vue-router": {
              name: "vue-router",
              test: /[\\/]node_modules[\\/]vue-router[\\/]/,
              priority: -10
            },
            "element-ui": {
              name: "element-ui",
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              priority: -10
            },
            vendors: {
              name: "vendors",
              test: /[\\/]node_modules[\\/]/,
              priority: -20
            }
          }
        }
      };
      //  配置webpack 压缩
      config.plugins.push;
      {
        new CompressionWebpackPlugin({
          test: /\.js$|.html$|.css$/,
          //  超过4kb压缩
          threshold: 4096
        });
      }
    }
  },
  devServer: {
    // host: "localhost",
    host: "0.0.0.0", //局域网和本地访问
    port: "8080",
    hot: true,
    /* 自动打开浏览器 */
    open: false,
    overlay: {
      warning: false,
      error: true
    },
    /* 跨域代理 */
    proxy: {
      "/api": {
        /* 目标代理服务器地址 */
        target: "http://192.168.1.102:8888", //
        /* 允许跨域 */
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
