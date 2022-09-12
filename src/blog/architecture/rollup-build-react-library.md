---
title: Rollup 打包 React 组件库
layout: BlogLayout
------------------

[[toc]]

[`rollup`](https://rollupjs.org/guide/en/) 是一个 `JavaScript` 模块打包器，在功能上要完成的事和`webpack`性质一样，就是将
小块代码编译成大块复杂的代码，例如 `library` 或应用程序。但应用程序`webpack`都是首选，相比之下，`rollup`更多是用于
`library` 打包，比如熟悉
的[vue](https://github.com/vuejs/vue/blob/main/scripts/config.js)、[react](https://github.com/facebook/react/tree/main/scripts/rollup)、`vuex`、
等都是用 `rollup` 进行打包的。

## webpack vs rollup

> webpack 更适合对于应用的打包，rollup 更适合对于库的打包。

### 为什么不用 webpack

- webpack 打包成`ES module`在目前版本`5.74.0`还是实验性质的 Api，见[output-type](https://webpack.js.org/configuration/output/#type-module)，
  而[`tree-shaking`](https://juejin.cn/post/7135217402983235592) 是建立在`ES module`之上的，无论是作为一个 JS library 还
  是组件库，这个特性在 2022 年的今天都是必备可少的（tree-shaking 按需加载）。而这个恰好是 `rollup` 的强项，要知道
  `tree-shaking` 就是 rollup 率先提出的。
- webpack 打包后得代码不精简，注入代码多，比如webpack打包的文件会添加一些自定义的模块加载代码`__webpack_require__`等工具函数，这些是一个library 库所不需要的。打包后的体积也比 `rollup` 的大。
- rollup Api 更简单纯粹（只是相比 webpack, config option 还是挺多的，但核心api就那几个，其实大部分用不上)，更容易配置出自己想要的 `output`

而 `Webpack `对于代码分割、静态资源导入、热更新、dev server等有着先天优势，相比 `rollup` 大而全，所以更适合 App 打包。所以常说*Rollup for
libraries, Webpack for apps*

### webpack打包实现按需加载
其实 `webpack` 在不开启实验性质输出`ES module`而是输出`cjs`下，也能实现按需加载，但要**借助 babel 插件**，即像`element-ui`这样

```js
import { Button } from 'element-ui';
```
打包输出的是 `cjs`，但是按**固定的文件夹目录输出**，即你的每个函数或者组件的入口都是 `webpack` 配置的`entry`，把每个组件打包成一个单独
的文件，再配合插件[babel-plugin-component](https://www.npmjs.com/package/babel-plugin-component)，就会转成

```js
var button = require('element-ui/lib/button');
require('element-ui/lib/theme-chalk/button.css');
```
同时实现了js和css的按需加载。

老版本的 `ant-design` 也是类似的，使用[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)按需加载 js
和 css 文件，最新的也是使用打包成 ES module `tree-shaking`了。 `babel-plugin-import` 插件通过**引入固定路径**的组件及组件
样式，替代手动 shaking 的过程。由此也可以确定打包后的文件路径（组件要求 lib/xx，样式文件要求 lib/xx/style/xx）和文件模
块**CommonJs**

```js
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);
// then
var _button = require('antd/lib/button');
require('antd/lib/button/style/css');
ReactDOM.render(<_button>xxxx</_button>);
```

但都 2022 年了，这种方式直接 pass 吧。

## 正题rollup

### first, 打包一个 js 文件

初始化

```shell
mkdir "rollup-react-component-library"
cd rollup-react-component-library
pnpm init
pnpm add rollup -D
mkdir src
```

在 `package.json` 的 `script` 字段中添加并执行：

```shell
"dev": "rollup -i src/index.js -o dist/bundle.js -f es"
```

![](./rollup-bundle-images/bundle1.png)

在这段指令中：

- `-i`指定要打包的文件，`-i`是`--input`的缩写。

- `src/index.js`是`-i`的参数，即打包入口文件。

- `-o`指定输出的文件，是`--output.file`或`--file`的缩写。(如果没有这个参数，则直接输出到控制台)

- `dist/bundle.js`是`-o`的参数，即输出文件。

- `-f`指定打包文件的格式，`-f`是`--format`的缩写。

- `es`是`-f`的参数，表示打包文件使用 ES6 模块规范。

`rollup` 支持的打包文件的格式有`amd, cjs, es\esm, iife, umd`。其中，amd 为 AMD 标准，cjs 为 CommonJS 标准(NodeJs)，esm\es
为 ES 模块标准，iife 为立即调用函数(浏览器)， `umd`同时支持 amd、cjs 和 iife。

### rollup 配置文件

在实际的工程中，都是使用配置文件，这不仅可以简化命令行操作，同时还能启用 `rollup` 的高级特性。

在项目根目录下创建`rollup.config.js`。

```js
export default {
  input: './src/index.js',
  output: [
    {
      file: './dist/my-lib-umd.js',
      format: 'umd',
      // 当入口文件有export时，'umd'格式必须指定name
      // 这样，在通过<script>标签引入时，才能通过name访问到export的内容。
      name: 'myLib',
    },
    {
      file: './dist/my-lib-es.js',
      format: 'es',
    },
    {
      file: './dist/my-lib-cjs.js',
      format: 'cjs',
    },
  ],
};
```

使用 `Rollup` 的配置文件，可以使用`rollup --config`或者`rollup -c`指令。

```json5
//修改package.json的script字段
{
  dev: 'rollup -c', // 默认使用rollup.config.js
  dev: 'rollup -c my.config.js', // 使用自定义的配置文件，my.config.js
}
```

![](./rollup-bundle-images/bundle2.png) 可以看出，同样的入口文件，`es`格式的文件体积最小。

在没有其他开发依赖，其实这样一个简单的 Js Sdk 的打包就配置完成的了。但现实往往没那么简单啊。

### rollup 插件

rollup 插件只有插件扩展功能，相当于兼顾了 webpack 的`loader`和`plugin`，常用插件：

- `@rollup/plugin-node-resolve`, 使用[node resolution algorithm ](https://nodejs.org/api/modules.html#all-together)查找
  模块，让 rollup 能够识别`node_modules`的第三方模块。这些`dependencies`应该在`package.json`中。
- `@rollup/plugin-commonjs`, rollup 默认是不支持 CommonJS 模块的，将 `CommonJS `的模块转换为 ES2015 供 rollup 处理。所以
  应该搭配`@rollup/plugin-node-resolve`使用，去打包那些 CommonJS dependencies
- `@rollup/plugin-babel`, rollup 的集成 babel 插件，即使用 babel 编译文件
- `@rollup/plugin-typescript`, 更好的集成 ts 的插件，比如可以做 ts=>js
- `rollup-plugin-visualizer`, 类似 webpack-bundle-analyzer,但展示的 bundle-size 图没有 webpack 那个好用
- `rollup-plugin-terser`, [terser](https://www.npmjs.com/package/terser)代码压缩
- `rollup-plugin-postcss`，处理 css，支持 css 文件的加载、css 加前缀、css 压缩、scss/less 等
- `rollup-plugin-peer-deps-external`，自动提取 package.json 中的依赖，再放入 `external` 配置中
- `@rollup/plugin-replace`，打包时替换设置的字符串
- `rollup-plugin-dts` 生成`.d.ts`文件
- [官方插件列表](https://github.com/rollup/plugins)

## 项目基本配置说明

这里最终的产出是一个按需加载的 React 组件库，使用的技术即`react、typescript、@emotion/react, Material UI`

- 这里 css 方案采用的 `css-in-js`，打包会比其他方案更简单， React组件库的 css 方案没有一种占统治地位，现有的各种方案都有各
  自的优缺点，因此选择一种合适的样式方案需要综合考虑很多方面。推荐文
  章[React 组件库 CSS 样式方案分析](https://segmentfault.com/a/1190000041840130)。后面会讲一下怎么处理要单独输出 style
  文件。
- `Material UI `引入是想更好的测试 `tree-shaking`，二次封装组件库也是实际业务常见的需求。

组件结构，button 简单示列：

```md
|-- src 
    |-- Button 
    | |-- Button.tsx 
    | |-- index.ts
    | |-- types.d.ts 
|-- index.ts
```

`Button.tsx`

```tsx
import * as React from 'react';
import { css } from '@emotion/react';

import type { ButtonProps } from './types';

const color = 'white';

const cssBtn = css`
  padding: 8px;
  background-color: hotpink;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    color: ${color};
  }
  border: 1px solid gray;
  transition: color 0.3s ease-in-out;
`;

const Button: React.FC<ButtonProps> = () => <button css={cssBtn}>Hover to change color.</button>;

export default Button;
```

`types.d.ts`

```ts
export type ButtonProps = {
  text: string;
};
```

`index.ts`

```ts
export { default } from './Button';
export * from './Button';
export type { ButtonProps } from './types';
```

`src/index.ts`

```ts
export { default as Button } from './Button';
export * from './Button';
// export type { ButtonProps } from './Button';
```
### typescript配置

这里打包时输出的类型文件时使用`tsc`构建输出的，

`tsconfig.type.json`
```json5
{
  "extends": "./tsconfig.json",
  "include": ["src"],
  "exclude": ["**/*__tests__"],
  "compilerOptions": {
    // 允许输出
    "noEmit": false,
    "declaration": true,
    // 只输出类型
    "emitDeclarationOnly": true,
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```
`package.json`

````json
{
  "script": {
    "build:type": "tsc -b --force --verbose tsconfig.type.json"
  }
}
````

- tsc: `-b` 即代表`--build`,`tsc -b`还支持其它一些选项：
    - --verbose：打印详细的日志（可以与其它标记一起使用）
    - --dry: 显示将要执行的操作但是并不真正进行这些操作
    - --clean: 删除指定工程的输出（可以与`--dry一`起使用）
    - --force: 把所有工程当作非最新版本对待
    - --watch: 观察模式（可以与`--verbose`一起使用）

### babel

babel配置可见后续`@rollup/plugin-babel`小节。

## rollup配置

先安装rollup两个必用到基础插件，作用见上插件列表说明。
```shell
pnpm add @rollup/plugin-node-resolve @rollup/plugin-commonjs -D
```

### 怎么处理Typescript

借助 `@babel/preset-typescript` 的能力，直接转译 ts 代码，一步到位，而不是采用` @rollup/plugin-typescript` 先将 ts 转成
js 然后再交给` @rollup/plugin-babel` 再转换一次，增加了适配成本。

### 如何排除公共依赖不打包仅组件中

使用 [`external`](https://rollupjs.org/guide/en/#external) 配置，将不需要打包依赖加进去；有些时候会使用依赖的子一级文件
，所以这个 `external` 可以是一个函数，其参数是引用的依赖地址，返回值是一个 boolean `true` 则表示，这个依赖不会被打包进去. 可以使用[rollup-plugin-peer-deps-external](https://www.npmjs.com/package/rollup-plugin-peer-deps-external)插件。

### `@rollup/plugin-babel`

用于转换 es6 语法、ts、react-jsx。安装

```shell
pnpm add @rollup/plugin-babel -D
pnpm add @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript -D
```

`babel.config.js`配置如下

```js
module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: '@emotion/react',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@emotion', '@babel/plugin-transform-runtime'],
};
```

这里`@babel/plugin-transform-runtime` 用于避免污染全局函数（不是必须要用到，但作为类库最好要加上）。 rollup 中的配置如下

```js
import babel from '@rollup/plugin-babel';

export default {
  plugins: [
    babel({
      extensions,
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
  ],
};
```

##### plugin-transform-runtime

> A plugin that enables the re-use of Babel's injected helper code to save on codesize.

为了浏览器向下兼容，会使用 `@babel/preset-env` 对每个文件的 ES6 语法进行转换，我们称之为辅助函数。

但样这做存在一个问题。在正常的前端工程开发的时候，少则几十个 js 文件，多则上千个。如果每个文件里都使用了 class 类语法，
那会导致每个转换后的文件上部都会注入这些相同的函数声明。这会用构建工具打包出来的包非常大,包含大量重复代码。一个思路就是
，把这些函数声明都放在一个`npm包`里，需要使用的时候直接从这个包里引入到我们的文件里。这样即使上千个文件，也会从相同地包
里引用这些函数。通过 `rollup/webpack` 这一类的构建工具打包的时候，只会把使用到的 npm 包里的函数引入一次，这样就做到了复
用，减少了体积。

安装 `@babel/runtime`包提供辅助函数模块，且是安装到`dependencies`，安装 Babel 插件 `@babel/plugin-transform-runtime` 来
自动替换辅助函数。

```shell
pnpm add @babel/runtime
pnpm add @babel/plugin-transform-runtime -D
```

效果如下：即如是这样导入 help 函数的`import _defineProperty from '@babel/runtime/helpers/defineProperty';`
![](./rollup-bundle-images/bundlebabel.png)

### 完整配置

#### package.json

```json
{
  "files": ["dist"],
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  },
  "sideEffects": false,
  "scripts": {
    "copy-d.ts": "copyfiles -u 1 src/**/*.d.ts dist",
    "build:type": "tsc -b --force --verbose tsconfig.type.json && pnpm run copy-d.ts",
    "build:dev": "pnpm run build:type && rollup -c -w --environment NODE_ENV:development",
    "build:all": "rm -rf dist && pnpm run build:type && rollup -c --environment NODE_ENV:production"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "dependencies": {
    "@babel/runtime": "^7.18.9",
    "@emotion/react": "^11.10.4",
    "@emotion/styled": "^11.10.4",
    "@mui/icons-material": "^5.10.3",
    "@mui/material": "^5.10.3"
  }
}
```

- files: 定义你的 NPM 包中要包含哪些文件
- main: 定义 CommonJS 入口,`main` 是一个当打包工具或运行时不支持 `package.json#exports` 时的兜底方案；如果打包工具或运行
  时支持 `package exports`，则不会使用 `main`。 `main` 应该指向一个兼容 `CommonJS` 格式的产出；它应该与
  `package exports` 中的 `require` 保持一致。
- types: 定义 TypeScript 类型
- exports: 为你的库定义公共 API
- sideEffects: 来允许 `treeshaking`, `false`代表所有模块都是“纯”的，没有副作用
- peerDependencies：如果你依赖别的框架或库，将它设置为 peer dependency

更多的详细自动可参 考[打包 JavaScript 库的现代化指南](https://github.com/frehner/modern-guide-to-packaging-js-library/blob/main/README-zh_CN.md)

- copyfiles: 后续会讲到，主要是 `tsc build `时不会处理`.d.ts`文件，单独复制。
- tsc: `-b` 即代表`--build`,`tsc -b`还支持其它一些选项：
    - `--verbose`：打印详细的日志（可以与其它标记一起使用）
    - `--dry`: 显示将要执行的操作但是并不真正进行这些操作
    - `--clean`: 删除指定工程的输出（可以与`--dry一`起使用）
    - `--force`: 把所有工程当作非最新版本对待
    - `--watch` : 观察模式（可以与`--verbose`一起使用）
- rollup: `-w` 即`-watch`监听模式
- rollup: `--environment NODE_ENV:development`, 设置环境变量[environment-values](https://rollupjs.org/guide/en/#--environment-values)

#### rollup.config.js
```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import externalDep from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

const input = './src/index.ts';
const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const isProd = process.env.NODE_ENV === 'production';

export default {
    input,
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      // 设置打入output file，包括peerDependencies和dependencies
      externalDep({
        // dependencies也不打包进output
        includeDependencies: true,
      }),
      resolve({
        extensions,
      }),
      commonjs(),
      babel({
        extensions,
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
      }),
      // production时压缩
      isProd &&
      terser({
        output: {
          comments: false,
        },
        compress: {
          // drop_console: true,
        },
      }),
      !isProd &&
      visualizer({
        filename: 'rollup-bundle-report.html',
      }),
    ],
};
```


输出大概是这样： ![](./rollup-bundle-images/output1.png)

虽然是输出的单文件的打包文件，但支持 `es module`，也是支持 `tree-shaking` 的。这样一个组件库的打包就基本完成了。

### 如何支持 scss/less

组件的样式方案是**样式和逻辑分离**，这种方案的优点有：

- 适用性广泛，可以支持组件库使用者的各种开发环境。
- 不限制组件库的技术栈，同一套样式可以用在基于多个框架的组件库上。
- 无需考虑对 SSR（服务端渲染）的支持，对外提供的是 CSS 文件，因此 SSR 流程完全交给组件库的使用者控制。
- 可以直接对外提供 less、sass 等源文件，便于外部覆盖变量，实现主题定制或换肤等功能。但是这种方案也有一些问题：

- 需要使用者手动引入样式文件。如果直接引入了完整的 CSS 文件，而在实际使用中并没有用到组件库里的全部组件，就会造成一些无
  用的样式被打包进项目中。
- 让组件库支持 CSS 按需引入的功能会比较复杂，既需要组件库的开发者在打包流程和产物上进行处理，又需要使用者按照一定规则引
  入样式文件。首先组件库开发者需要定一套样式文件的目录组织规范，使其能在打包流程中支持以组件为单位打包样式文件，之后使用
  者就可以按需手动引入对应组件的样式文件。对于具有特定目录组织规范的组件库，目前已经有插件可以在编译阶段辅助生成引入样式
  的 import 语句，例如 `babel-plugin-import`、`unplugin-vue-components` 等。如开篇讲的列子
- 如果组件库内部的组件存在引用关系，为了实现按需引入，打包出来的组件的样式可能会存在冗余。

#### 如何配置

安装插件，`rollup-plugin-postcss`支持 css 文件的加载、css 加前缀、css 压缩、对 scss/less 的支持，用这个就能搞定。

```shell
pnpm add postcss rollup-plugin-postcss --dev
```

添加到 rollup

```js
import postcss from 'rollup-plugin-postcss';
export default {
  // input: ...,
  // output: ...,
  plugins: [postcss()],
};
```

这样子只会在 umd 下生效，css 样式生成`style`标签内联到`head`中。在工程中使用一般需要额外引入样式文件。所以需要抽离单独的
css 文件。`rollup-plugin-postcss`配置即可，另外还要启用`modules`, 即**CSS modules**，隔离组件库样式。

```js
postcss({
  extract: 'index.css',
  // 压缩
  minimize: true,
  // Enable CSS modules
  modules: true,
});
```

启用`CSS modules`后，样式引用要改为：

```tsx
import * as React from 'react';
import type { AlertProps } from './types';
import css from './style.css';

const Alert: React.FC<AlertProps> = () => {
  return <div className={css.alert}>Alert</div>;
};

export default Alert;
```

输出的`className`才能和 `index.css` 中匹配

`index.css`

```css
.style_alert__ZRjcy {
  background: #535bf2;
}
```

* 额外配置

1. `css modules` typescript 报错，新增文件`global.d.ts`:

```ts
declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
```

2. 在测试包时，`import 'rollup-react-component-library/dist/index.css'`引入`dist`的`index.css`时 webpack 出现错误找不到模块；

参考问题[Declare .css in package.json exports](https://github.com/vitejs/vite/discussions/2657)，package.json 新增配置即可

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    },
    "./dist/index.css": {
      "import": "./dist/index.css",
      "require": "./dist/index.css"
    }
  },
  "sideEffects": ["*.sass", "*.scss", "*.css"]
}
```

3. sideEffects 要从`false` => 如上，不然 `webpack`会把`import`的css tree-shaking 掉

#### css 加前缀

借助`autoprefixer`插件来给`css3`的一些属性加前缀。安装`pnpm i autoprefixer@8.0.0 -D`，配置：

```js
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
export default {
  plugins: [
    postcss({
      plugins: [autoprefixer()],
    }),
  ],
};
```

使用`autoprefixer`除了以上配置，还需要配置`browserslis`t，有 2 种方式，一种是建立`.browserslistrc`文件，另一种是直接在
package.json 里面配置，我们在 package.json 中，添加`browserslist`字段。

```json
{
  "browserslist": ["defaults", "not ie < 8", "last 2 versions", "> 1%", "iOS 7", "last 3 iOS versions"]
}
```

#### css 压缩

即开启`minimize`选项。实际上使用的[cssnano](https://www.npmjs.com/package/cssnano)压缩。

#### 支持 scss/less

项目中一般不会写 css，而是用`scss`或`less`等预编译器。`rollup-plugin-postcss`默认集成了对`scss、less、stylus`的支持。但额外需要
安装依赖，如官网所示：

- For Sass install node-sass: `pnpm add node-sass --dev`
- For Stylus Install stylus: `pnpm add stylus --dev`
- For Less Install less: `pnpm add less --dev`

以上的**样式和逻辑分离**方案才基本可用，可以发现比`css-in-js`麻烦多了，而且现在还未实现样式的按需加载，要想使用者使用方便，就要按组件目录结构输出样式目录，用于`sideEffects`配置和`babel`插件（这块开头有讲过）。

### 组件按目录结构输出

#### `rollup-plugin-postcss` => `rollup-plugin-styles`

上面的`rollup-plugin-postcss` 这个插件只会把所有组件的样式抽离抽离出一个单独的文件，适合输出到`dist`文件夹，但这个场景下，
在查找一番后，要使用[`rollup-plugin-styles`](https://www.npmjs.com/package/rollup-plugin-styles) 这个插件，它可以与 以下会用到的rollup output的`preserveModules `做适配，即输出按照组件维度拆分的 css 文件，不过要想正确地实现这个功能需要做一些配置。
```shell
pnpm add rollup-plugin-styles -D
```
#### [output.preserveModules](https://rollupjs.org/guide/en/#outputpreservemodules)

这里组件按原始目录结构输出使用 [output.preserveModules](https://rollupjs.org/guide/en/#outputpreservemodules) , `output.preserveModulesRoot`，中文官网还没有配置，所以文档还是看英文的最新，关于这个配置，看了挺多
比较常见的组件库，都没有用这个配置输出，一般都是用`rollup`输出单一打包文件，后来是翻到一下文章有提到这样也可以实现，而这个配置主要是

>Instead of creating as few chunks as possible, this mode will create separate chunks for all modules using the original module names as file names. Requires the `output.dir` option. Tree-shaking will still be applied, suppressing files that are not used by the provided entry points or do not have side effects when executed. This mode can be used to transform a file structure to a different module format.

和常规模式尽可能创建更少的`chunk`不一样，这个模式会按原始的模块划分，分别输出文件，要求`output.dir`必须声明，即输出的是目录，之前的`out.file`就不能用了，且Tree-shaking依然适用。

实现主要思路是查找每个`component`的入口，并放入`input`数组，再开启`preserveModules`模式。

`rollup.esm.js`具体配置
```js
// 同之前
import styled from 'rollup-plugin-styles';

const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const isProd = process.env.NODE_ENV === 'production';

const entryFile = 'src/index.ts';
// 可以时在多一级也可以，'src/components'
const componentDir = 'src';
const componentEntryFiles = fs
  .readdirSync(path.resolve(componentDir), {
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory() && /^[A-Z]\w*/.test(dirent.name))
  .map((dirent) => `${componentDir}/${dirent.name}/index.ts`);

export default [
  {
    input: [entryFile, ...componentEntryFiles],
    output: [
      {
        dir: 'esm',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        assetFileNames: ({ name }) => {
          // console.log(name);
          // 抽离后的样式文件会作为 asset 输出，这里可以配置一下 样式文件的输出位置（为 babel-plugin-import 做准备）
          const { ext, dir, base } = path.parse(name);
          // console.log(ext);

          if (ext !== '.css') return '[name].[ext]';
          // 输出到style目录，便于tree-shaking
          return path.join(dir, 'style', base);
        },
      },
    ],
    plugins: [
      // 其他插件一样
      styled({
        // 抽出css，而不是打包进js
        mode: 'extract',
        // use: ['less'],
        // less: {
        //   javascriptEnabled: true,
        // },
        extensions: ['.less', '.css'],
        minimize: true,
        // CSS Modules
        modules: false,
        sourceMap: true,
        url: {
          inline: true,
        },
        onExtract: (data) => {
          // 以下操作用来确保每个组件目录只输出一个 index.css，实际上每一个子级组件都会输出样式文件，index.css 会包含所有子组件的样式
          const { css, name, map } = data;
          const { base } = path.parse(name);
          if (base !== 'index.css') return false;
          return true;
        },
      }),
    ],
  },
];
```

> `rollup-plugin-styles`文档不全，目前发现使用`css module`的模式下，代码并没有抽离，目前还是使用的常规class。

另外还需要修改`package.json`才能使输出生效

```json
{
  "files": ["dist", "esm"],
  "main": "dist/index.cjs.js",
  "module": "esm/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./dist/index.cjs.js"
    }
  },
  "sideEffects": [
    "esm/**/style/*",
    "lib/**/style/*",
    "*.css"
  ]
}
```
再搭配[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)即可，可以看到整个实现真的麻烦，所以还是选择`css-in-js`把，也有支持零运行的框架，比如[Vanilla-extract](https://vanilla-extract.style/)。

### 如何调试
1. monorepo架构下的项目，比如`pnpm+workspace`，直接安装即可

比如在本地把`pkg1`安装到 `pkg2`
```shell
pnpm install @sysuke/pkg1 --filter @sysuke/pkg2
```
2. `pnpm/yarn link`， 不好用，会出现[Invalid Hook Call Warning](https://reactjs.org/warnings/invalid-hook-call-warning.html)的错误
3. webpack alias

 `webpack.config.js`
```shell
webpack: {
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react')
    }
  }
}
```

4. [yalc](https://www.npmjs.com/package/yalc)

可参考文章[居然有比 npm link 更好的调试？](https://mp.weixin.qq.com/s/I4hhrgI3-Y18HD8zw_9g9w)

## 总结

使用rollup打包一个可用的react组件库基本实现，源代码见[rollup-react-component-library](https://github.com/qinsong77/sysuke/tree/main/demos/rollup-react-component-library)，其实一些常见的组件库，如`mui`，`ant-design`, [naive-ui](https://github.com/tusen-ai/naive-ui)等，在打包成es module，按模块
打包输出时，都是用的其他方式，比如babel，tsc等，后面会补一篇文章去解析其他开源的组件库是如何打包的。

## 踩坑记录

#### rollup插件是数组，有的插件使用是有顺序的

比如 `@rollup/plugin-babel`就要求 `@rollup/plugin-commonjs`必须在前面，所以要好好看插件文档再使用。

#### `rollup-plugin-dts`输出单个文件的类型文件，不适合组件库这种类型输出很多的library，不如使用`tsc`，还能按目录输出，无其他依赖配置也简单

##### `tsc --build ...`构建输出的类型文件，并不会处理`.d.ts`文件

即如果 `src` 的类型文件是`.d.ts`结尾的，编译构建时`tsc`不会处理，导致文件不会复制到`outDir`。解决方式主要有 2 种

- `.d.ts`重命名为`.ts`
- 构建阶段单独处理，复制文件到输出目录，这里使用的[copyfiles](https://www.npmjs.com/package/copyfiles)

```json
{
  "scripts": {
    "copy-d.ts": "copyfiles -u 1 src/**/*.d.ts dist"
  }
}
```

#### 用 `tsc` 编译的后，映射的路径（即配置的[path](https://www.typescriptlang.org/tsconfig#paths) ）不会处理，将导致编译后的代码找不到模块。

TypeScript 编译时并不会重写 `module paths`， `path`是设计用来让 typescript 理解其他 bundle 工具的路径别名，比如 webpack 的 `resolve alias`，项目中我选的以下方案的 `tsc-alias`，只需配置到script，本demo暂未用到。
- [Path aliases with TypeScript in Node.js](https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353)
- [tsc-alias](https://www.npmjs.com/package/tsc-alias)
- [module-alias](https://www.npmjs.com/package/module-alias)

#### 不止是`peerDependencies`要`external`,`dependencies`的依赖也需要。

在最开始使用`rollup`打包时，只把`peerDependencies`设置到external了，发现打包体积比较大，且在使用`output.preserveModules`时有问题，打包的结果还会多个
`node_modules`目录，当时完全找不到头绪，后来看了一些组件库源码，比如 `ant-design`:

![](./rollup-bundle-images/antd.png)
其实`dependencies`也要`external`掉（当然不是amd格式时），使用时这些依赖也会安装。

#### 如果在已经使用了`babel + @babel/preset-typescript`时, `rollup-plugin-typescript2`插件不需要，转换 ts 同样的事没必要做 2 次。

#### `@babel/runtime`

- 应该作为`dependency`，并且当作`external`
- 配置到`external`, `external: ["@babel/runtime"]` 这样配置是不工作的，得`external: [/@babel\/runtime/]`或者一个函数`(external: id => id.includes('@babel/runtime')`,`@emotion/react`也是
- [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
  的[useESModules](https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules)自`7.13.0`就遗弃了，不用去考虑
  打包时`esm`和`cjs`这块有影响，去区分对待

文档其实这块写得很清楚[@rollup/plugin-babel.babelHelpers.runtime](https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers)

#### sideEffects
`package.json` 中声明 `sideEffects` 属性

> 在一个纯粹的 ESM 模块世界中，识别出哪些文件有副作用很简单。然而，我们的项目无法达到这种纯度，所以，此时有必要向
> webpack 的 compiler 提供提示哪些代码是“纯粹部分”。 —— 《webpack 文档》

注意：样式部分是有副作用的！即不应该被 tree-shaking！

若是直接声明 `sideEffects` 为 `false`，那么打包时将不包括样式！所以应该像下面这样配置：

```json
{
  "sideEffects": ["*.sass", "*.scss", "*.css"]
}
```

#### [@rollup/plugin-multi-entry](https://github.com/rollup/plugins/tree/master/packages/multi-entry)不好用，自己写脚本处理多入口吧
简单试了下，会有些额外的输出，比如这个`_virtual`文件夹。
![](./rollup-bundle-images/plugin-multi-entry.png)

- `entryFileName`不支持函数
- `index.ts` 输出到一个`_virtual`文件夹，不知道怎么出现的, 可能用这个插件[@rollup/plugin-virtual](https://www.npmjs.com/package/@rollup/plugin-virtual)解决
- 只输出了 `entry index` ，component 目录没有按原始目录输出文件

#### [output.preserveModules](https://rollupjs.org/guide/en/#outputpreservemodules)也不太好用
虽然用这个配置成功按模块输出，但有的情况下有问题，比如上面也提到过，`dependencies`不排除（external）时，会多输出文件夹，比如`node_modules`
- [preserveModules creates wrong output](https://github.com/rollup/rollup/issues/3743)
- [Why does the preserveModules option generate node_modules folder](https://github.com/rollup/rollup/issues/3684)

#### 当把dependencies打包入output时，比如会发现react同时打入了`react.development.js`和`react.production.js`

使用`@rollup/plugin-replace`解决，参考react官网，[Optimizing Performance](https://reactjs.org/docs/optimizing-performance.html#rollup)

## Reference

- [rollup](https://rollupjs.org/guide/en/)
- [rollup 从入门到打包一个按需加载的组件库](https://mp.weixin.qq.com/s/Rk729v6VI0IbwVPsuaPdOw)
- [Typescript does not copy d.ts files to build](https://stackoverflow.com/questions/56018167/typescript-does-not-copy-d-ts-files-to-build)
- [Why I use Rollup, and not Webpack](https://medium.com/@PepsRyuu/why-i-use-rollup-and-not-webpack-e3ab163f4fd3)
- [Rollup Config for React Component Library With TypeScript + SCSS](https://www.codefeetime.com/post/rollup-config-for-react-component-library-with-typescript-scss/)
- [How to Create and Publish a React Component Library](https://dev.to/alexeagleson/how-to-create-and-publish-a-react-component-library-2oe)
- [Rollup2.x 搭建 React 组件库](https://blog.csdn.net/mjzhang1993/article/details/112575745)
- [How to support subpath imports using React+Rollup+Typescript](https://medium.com/singapore-gds/how-to-support-subpath-imports-using-react-rollup-typescript-1d3d331f821b)
