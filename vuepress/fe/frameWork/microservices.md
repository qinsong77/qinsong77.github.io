---
title: 微前端
---

### [qiankun微前端方案实践及总结](https://juejin.im/post/6844904185910018062)
### [qiankun微前端实践总结（二）](https://juejin.im/post/6856569463950639117)
### [详细解析微前端、微前端框架qiankun以及源码](https://segmentfault.com/a/1190000022275991)
### [万字长文+图文并茂+全面解析 qiankun 源码 - qiankun 篇](https://www.jianshu.com/p/db08174fa4fc/)

### [一篇英语介绍文章](https://micro-frontends.org/)

#### `__INJECTED_PUBLIC_PATH_BY_QIANKUN__`ng
`__INJECTED_PUBLIC_PATH_BY_QIANKUN__`这个变量是子应用配置的entry的域名路径，如`entry`的路径是`www.test.com/subapp/device`，他的值是`www.test.com/subapp/`,而
是`www.test.com/subapp/device/`的话,值就是`entry`，即`www.test.com/subapp/device/`。末尾带不带`/`的影响。

- `http://wwww.baidu.com`: 这种 URI 并没有直接指定要访问哪个文件，像这种没有路径的情况，就代表访问根目录下预先设置的默认文件，一般就是 `/index.html`，`/default.html` 一类的文件，在 Java 中，我们也可以在 web.xml 中来配置这个默认文件。
- `http://www.baidu.com/folder/`: 这个 URI 以一个 `/` 结尾，表示 folder 是一个目录，我们要访问的是这个目录下的文件，但是又没有说明是这个目录下的哪个文件，此时依然是采用该目录下 index.html 或者 default.html 一类的文件。 
- `http://www.baidu.com/folder`: 即 `folder` 后面没有 `/`，此时会先将 `folder` 当作一个资源去访问(比如一个名为 folder 的 Servlet )，如果没有名为 folder 的资源，那么浏览器会自动在 `folder` 后面加上一个 / ，此时地址变为 `http://www.baidu.com/folder/` ，folder 是一个目录，然后就会去尝试访问 folder 目录下的 `index.html` 或者 default.html。  
注意这种自动调整只在浏览器中存在，如果你的项目是一个手机 App 或者你是一个 Ajax 请求，则不会有这种调整，即没写 `/` 就当做具体资源来对待，如果该资源不存在，就会报 404 ，写了`/ `就当目录来对待。
- `http://www.baidu.com/`: 第一种情况很类似，只是后面多了一个 / ，这个 / 表示我们要访问的是根目录，但是没有指定根目录下的文件，默认就是根目录下的 index.html 或者 default.html 。


这个属性可以在运行时修改webpack的publicPath，打包时这个配置是已经注入到js或者css的url中了。
但用import异步引用的时候，比如Vue的路由懒加载，是靠`__webpack_require__`实现，创建`script`标签，`document.head.appendChild(script)`到head中

```javascript
//public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

`__webpack_require__`

`__webpack_require__.p = the bundle public path`

```javascript

 // The require function
 function __webpack_require__(moduleId) {
 
 	// 检测是否存在缓存
 	if(installedModules[moduleId]) {
 		return installedModules[moduleId].exports;
 	}
 	// 不存在则生成新的模块
 	var module = installedModules[moduleId] = {
 		i: moduleId,
 		l: false,    // 是否加载
 		exports: {}
 	};
 
 	// call的方式加载模块 this转交，参数转交，对应其打包构建好的每个模块的参数结构。
 	modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 
 	// 表示已加载
 	module.l = true;
 
 	// 返回模块的exports 
 	return module.exports;

```

以下是__webpack_require__各属性以及对应能力，会经常出现在加载模块的语法中

```dotenv

// 入口模块的ID
__webpack_require__.s = the module id of the entry point
 
//模块缓存对象 {} id:{ exports /id/loaded}
__webpack_require__.c = the module cache
 
// 所有构建生成的模块 []
__webpack_require__.m = the module functions
 
// 公共路径，为所有资源指定一个基础路径
__webpack_require__.p = the bundle public path
// 
__webpack_require__.i = the identity function used for harmony imports
 
// 异步模块加载函数，如果没有再缓存模块中 则用jsonscriptsrc 加载  
__webpack_require__.e = the chunk ensure function
 
// 设定getter 辅助函数而已
__webpack_require__.d = the exported property define getter function
 
// 辅助函数而已 Object.prototype.hasOwnProperty.call
__webpack_require__.o = Object.prototype.hasOwnProperty.call
 
// 给exports设定attr __esModule
__webpack_require__.r = define compatibility on export
 
// 用于取值，伪造namespace
__webpack_require__.t = create a fake namespace object
 
// 用于兼容性取值（esmodule 取default， 非esmodule 直接返回module)
__webpack_require__.n = compatibility get default export
 
// hash
__webpack_require__.h = the webpack hash
 
// 
__webpack_require__.w = an object containing all installed WebAssembly.Instance export objects keyed by module id
 
// 异步加载失败处理函数 辅助函数而已
__webpack_require__.oe = the uncaught error handler for the webpack runtime
 
// 表明脚本需要安全加载 CSP策略
__webpack_require__.nc = the script nonce

```

### 部署遇到的问题

1、部署在k8s中，测试环境使用Ingress配置域名路径，可直接配置PathWrite，因为在
容器中访问的地址是是不带PUBLIC_PATH的，比如http://www.onetv3.com/ops/css/styles.169c8319.css这个路径转过去是http://11.12.6.24:32149/ops/css/styles.169c8319.css。
                         应该是http://11.12.6.24:32149/css/styles.169c8319.css才对。
也可配置nginx 重新路径 比如使用alias

[k8s ingress原理及ingress-nginx部署测试](https://segmentfault.com/a/1190000019908991)

[Nginx 配置中nginx和alias的区别分析](https://blog.csdn.net/tuoni123/article/details/79712246)
```nginx
server {
    listen       80;
    server_name  localhost;

    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Cache-Control no-cache;
        root  /data/www;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /subapp/ram/ {
        alias /data/www/;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

```

#### nginx配置proxy_pass时url末尾带“/”与不带“/”的区别
当`location`为正则表达式匹配模式时，`proxy_pass`中的url末尾是不允许有"/"的，因此正则表达式匹配模式不在讨论范围内。
**proxy_pass配置中url末尾带/时，nginx转发时，会将原uri去除location匹配表达式后的内容拼接在proxy_pass中url之后。**
测试地址：http://192.168.171.129/test/index.html
- 场景一：
```dotenv
location ^~ /test/ {
 proxy_pass http://192.168.171.129:8080/server/;
}
```
代理后实际访问地址：http://192.168.171.129:8080/server/index.html
```dotenv
location ^~ /test {
 proxy_pass http://192.168.171.129:8080/server/;
}
```
场景二：
代理后实际访问地址：http://192.168.171.129:8080/server//index.html

proxy_pass配置中url末尾不带/时，如url中不包含path，则直接将原uri拼接在proxy_pass中url之后；如url中包含path，则将原uri去除location匹配表达式后的内容拼接在proxy_pass中的url之后。


### 打包成UMD, UMD
> 一个整合了commonJS和AMD规范的方法。希望能解决跨平台模块的解决方案。

运行的原理：

UMD会先判断是否支持Node.js的模块（export)是不是存在。存在则使用node.js的模块方式。

再判断是不是支持AMD(define是不是存在。存在则使用AMD方式加载模块。
![An image](../image/umd.png)
```javascript
(function(root, factory){
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else if (typeof exports === 'object') {
        exports['subapp-ram'] = factory()
    } else root['subapp-ram'] = factory()
})(this,function () {
    //    do something
})
```
#### 总结

 - 1、使用html-webpack-externals-plugin抽取公共库及UI库资源；
    由于是要私有化部署，没有CDN，选择了再主应用中安装UI库包（主应用没有使用UI框架），使用copy-webpack-plugin插件，复制js,css文件到static文件夹,
    如下配置，但css中字体文件路径有问题，需要处理，选择在构建完后添加glup处理，如下
    `"build:one": "vue-cli-service build --mode one && gulp --gulpfile cdn-adaptor.js",`
##### cdn-adaptor.js
```javascript
const gulp = require('gulp');
const through2 = require('through2');

function fontPathChanger() {
  return through2.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    // eslint-disable-next-line
      let str = file.contents
      .toString()
      .replace(/fonts\/ionicons/g, `/ops/static/one-ui/styles/fonts/ionicons`);
    file.contents = Buffer.from(str);

    cb(null, file);
  });
}

// 处理css font 路径
gulp.task('css', function(cb) {
  gulp
    .src('dist/static/one-ui/styles/one-ui.css')
    .pipe(fontPathChanger())
    .pipe(gulp.dest(`dist/static/one-ui/styles`));
  cb();
});

gulp.task('default', gulp.parallel('css'));
```
    


#### 主应用vue.config.jg

```javascript
const path = require('path');
const Copy = require('copy-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const resolve = dir => {
  return path.join(__dirname, dir);
};

console.log('env:',
  'NODE_ENV', process.env.NODE_ENV,
  'VUE_APP_API_BASE_URL', process.env.VUE_APP_API_BASE_URL,
  'CDN_DOMIAN', process.env.CDN_DOMIAN
)
module.exports = {
  publicPath: '/ops',
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'));
    config
      .plugin('html')
      .tap(args => {
      args[0].CDN_DOMIAN = process.env.CDN_DOMIAN; // 添加cdn index.html引入
      return args;
    });
    config.optimization.splitChunks({
      cacheGroups: {
        // 将动态引入的css合并成一个css文件
        async: {
          name: 'styles',
          test: m => m.constructor.name === 'CssModule',
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        vendors: {
          name: 'chunk-vendors',
          // eslint-disable-next-line no-useless-escape
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    });
    // 外部链接优化
    config
      .plugin('htmlExternals')
      .after('html')
      .use(HtmlWebpackExternalsPlugin, [
        {
          externals: [
            {
              module: 'vue',
              entry: {
                path: `${process.env.CDN_DOMIAN}/vue/vue.min.js`,
                type: 'js'
              },
              global: 'Vue'
            },
            {
              module: 'vue-router',
              entry: {
                path: `${process.env.CDN_DOMIAN}/vue/vue-router.min.js`,
                type: 'js'
              },
              global: 'VueRouter'
            },
            {
              module: 'vuex',
              entry: {
                path: `${process.env.CDN_DOMIAN}/vue/vuex.min.js`,
                type: 'js'
              },
              global: 'Vuex'
            }
          ],
          enabled: process.env.NODE_ENV === 'production'
        }
      ]);
  },
  configureWebpack: {
    plugins: [
      new Copy([
        {
          from: path.resolve(__dirname, 'node_modules/@cmi/one-ui/dist'),
          to: 'static/one-ui',
          ignore: ['.*']
        },
        {
          from: path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js'),
          to: 'static/vue',
          ignore: ['.*']
        },
        {
          from: path.resolve(__dirname, 'node_modules/vuex/dist/vuex.min.js'),
          to: 'static/vue',
          ignore: ['.*']
        },
        {
          from: path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.min.js'),
          to: 'static/vue',
          ignore: ['.*']
        }
      ])
    ]
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      [process.env.VUE_APP_API_BASE_URL]: {
        target: 'http://ops.test.com',
        changeOrigin: true
      },
      '/api/v1': {
        target: 'http://ops.test.com',
        changeOrigin: true
      }
    }
  }
};

```

##### 子应用vue.config.js

```dotenv
VUE_APP_ROUTER_BASE_URL=/ops/stateManage
VUE_APP_API_BASE_URL=/ops/api/ram/api/v1
FONT_BASE_URL=/ops/subapp/stateManage
PUBLIC_PATH=/ops/subapp/stateManage
CDN_DOMIAN=http://www.one.com/ops/static
```
```javascript
const path = require('path')
const packages = require('./package.json')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}
console.log('env:',
  'VUE_APP_ROUTER_BASE_URL', process.env.VUE_APP_ROUTER_BASE_URL, // 路由要和父应用激活路由对应
  'VUE_APP_API_BASE_URL', process.env.VUE_APP_API_BASE_URL,
  'FONT_BASE_URL', process.env.FONT_BASE_URL, // 本地写死路径不然本地主应用显示会有问题
  'PUBLIC_PATH', process.env.PUBLIC_PATH, // 与子应用访问路径相同
  'CDN_DOMIAN', process.env.CDN_DOMIAN
)

module.exports = {
  productionSourceMap: false,
  publicPath: process.env.PUBLIC_PATH,
  devServer: {
    contentBase: 'static',
    proxy: {
      '/api/v1': {
        target: 'http://ops.test.com',
        changeOrigin: true
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: '0.0.0.0',
    port: 8082,
    open: true
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/css/var.scss";'
      }
    }
  },
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${packages.name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packages.name}`
    },
    plugins: [
    ]
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))
      .set('_com', resolve('src/common'))
      .set('static', resolve('static'))
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
    config.module.rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        // 字体文件在嵌入乾坤时，可能需要生成完整的路径，通过环境变量PUBLIC_PATH注入
        return {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:4].[ext]',
              publicPath: process.env.FONT_BASE_URL
            }
          }
        }
      })
    // 图片内联大小限制2kb
    config.module.rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 2048
        options.fallback.options.publicPath = process.env.FONT_BASE_URL
        return options
      })
    config.optimization.splitChunks({
      cacheGroups: {
        // 将动态引入的css合并成一个css文件
        async: {
          name: 'styles',
          test: (m) => m.constructor.name === 'CssModule',
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        vendors: {
          name: 'chunk-vendors',
          // eslint-disable-next-line no-useless-escape
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })
    // 外部链接优化
    config.plugin('htmlExternals').after('html').use(HtmlWebpackExternalsPlugin, [
      {
        externals: [
          {
            module: 'vue',
            entry: {
              path: `${process.env.CDN_DOMIAN}/vue/vue.min.js`,
              type: 'js'
            },
            global: 'Vue'
          },
          {
            module: 'vue-router',
            entry: {
              path: `${process.env.CDN_DOMIAN}/vue/vue-router.min.js`,
              type: 'js'
            },
            global: 'VueRouter'
          },
          {
            module: 'vuex',
            entry: {
              path: `${process.env.CDN_DOMIAN}/vue/vuex.min.js`,
              type: 'js'
            },
            global: 'Vuex'
          },
          {
            module: '@cmi/one-ui',
            entry: `${process.env.CDN_DOMIAN}/one-ui/one-ui.min.js`,
            global: 'one-ui'
          },
          {
            module: '@cmi/one-ui/dist/styles/one-ui.css',
            entry: {
              path: `${process.env.CDN_DOMIAN}/one-ui/styles/one-ui.css`,
              type: 'css'
            }
          }
        ],
        enabled: !!process.env.CDN_DOMIAN
      }
    ])
    // 配置gzip压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression').use(CompressionPlugin, [
        {
          test: /\.js$|\.css$/, // 匹配文件名
          threshold: 10240, // 对超过10K的数据进行压缩
          deleteOriginalAssets: false // 是否删除源文件（建议false，万一ng没把gizp_static 开起就JJ了）
        }
      ])
    }
  }
}

```
