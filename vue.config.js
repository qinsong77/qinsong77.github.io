const path = require('path')

// 拼接路径
function resolve (dir) {
    return path.join(__dirname, dir)
}

// 基础路径 注意发布之前要先修改这里
let baseUrl = '/'
// 演示项目自动构建使用

module.exports = {
    baseUrl: baseUrl,
    outputDir: 'docs',
    lintOnSave: true,
    productionSourceMap: true,
    devServer: {
        publicPath: baseUrl // 和 baseUrl 保持一致
    },
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve
            .symlinks(true)

        // 重新设置 alias
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_v', resolve('src/views'))
            .set('_c', resolve('src/components'))
            .set('_com', resolve('src/common'))
            // babel-polyfill 加入 entry
            // const entry = config.entry('app')
            // entry
            //   .add('babel-polyfill')
            //   .end()
    },
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.scss` 这个文件
                data: `@import "@/style/variables.scss";@import "@/style/mixins.scss";`
            }
        }
    }
}
