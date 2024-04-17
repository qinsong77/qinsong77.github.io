
# 从零搭建 webpack5 + React + Typescript + Jest 基础模版
> not Done

* repo下READMEN是最新的
[github](https://github.com/qinsong77/webpack5-react-template)

## 初始化 package.json

这里使用`pnpm`管理`package`，`pnpm`相比npm，yarn最大的优点就是节约磁盘空间并提升安装速度，在我用`pnpm-workspace+turborepo`搭建monorepo的项目中，感触颇深，得益于pnpm，在monorepo下即使有几十个app+package，安装速度也在接受范围内。
所以后续的所有命令都使用`pnpm`完成。
初始化：

```shell
mkdir webpack5-react-template
cd webpack5-react-template 
pnpm init
```

![](./webpack5-images/shoot1.png)
先稍微介绍下`package.json`中几个主要的字段如`dependencies`,`devDependencies`,`peerDependencies`,`scripts`的意思。

- dependencies: 生产环境，项目运行的依赖（如：react,react-dom）
- devDependencies: 开发环境，项目所需的依赖（如：webpack插件，打包插件，压缩插件，eslint等）
- scripts: 指定了运行脚本命令的npm命令行缩写
- private：如果设为true，无法通过`npm publish`发布代码。

官网解释[文档](https://docs.npmjs.com/cli/v8/configuring-npm/package-json/)

## typescript

```shell
pnpm add typescript -D
# tsc --init命令创建tsconfig.json
pnpm exec tsc --init 
```

这个时候项目跟目录下会生成一份`tsconfig.json`文件，删除了多余的注释，内容如下:
```shell
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true
    }
}
```
添加配置如下
```json5
{
  /* Visit https://aka.ms/tsconfig to read more about this file */
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "es6",  /* 指定 ECMAScript 目标版本：'ES3'、'ES5'（默认）、'ES2015'、'ES2016'、'ES2017'、'ES2018'、'ES2019'、'ES2020' 或 'ESNEXT'。 */
    "module": "esnext", /*TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array" */
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],  /* 指定要包含在编译中的库文件。 */
    "allowJs": false, /* 不允许编译器编译JS，JSX文件 */
    "noEmit": true, /* 不输出文件,即编译后不会生成任何js文件 */

    "strict": true, /* 启用所有严格的类型检查选项。 */

    "moduleResolution": "node", /** 模块解析策略，ts默认用node的解析策略，即相对的方式导入 */
    "allowSyntheticDefaultImports": true, /* 允许从没有默认导出的模块中默认导入。 这不会影响代码发出，只是类型检查。 */
    "esModuleInterop": true, /* 允许export=导出，由import from 导入 */

    "noFallthroughCasesInSwitch": true,  /* 在 switch 语句中报告失败情况的错误。 */

    "resolveJsonModule": true, /* 可以导入json文件 */
    "isolatedModules": true, /* 将每个文件转换为一个单独的模块（类似于 'ts.transpileModule'）。 */
    "jsx": "react-jsx",

    "skipLibCheck": true, /* 跳过声明文件的类型检查。 */
    "forceConsistentCasingInFileNames": true, /* 禁止对同一文件的大小写不一致地引用。 */
  },
  "include": [
    "src"
  ]
}
```

## 引入React

安装react

```shell
pnpm i react react-dom
# 安装类型校验
pnpm i @types/react @types/react-dom -D
```

新建`src`目录，和`index.tsx`和`app.tsx`文件

```tsx
// index
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// app.tsx
const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
```

### `import React from ‘react’` 和 `import * as React from 'react'`区别

示例代码
```js
// constant.js
export const a = 1
const b = 2
export default b 

// index.ts
import constant from './constant'
console.log(constant)
```

不管是 ts 还是 babel，在将 esm 编译为 cjs 的时候，对于 `export default` 的处理，都会放在一个 `default `的属性上，即 `module.exports.default = xxx`，上面编译的结果大致为：

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true }); // 标示这是一个 esm 模块
exports.a = 1;
var b = 2;
exports.default = b;

// index.ts
var _constant = require("./constant");

// esm 和 cjs 的兼容处理
var constant_1 = _constant.__esModule ? _constant : {default: _constant}; 
console.log(constant_1.default);
```

在默认情况下ts会将`esm`模块编译成`commonjs`

- 对于 `export default `的变量，ts会将其放在` module.exports` 的 `default` 属性上
- 对于 `export` 的变量，ts会将其放在 `module.exports` 对应变量名的属性上
- 额外给 `module.exports` 增加一个 `__esModule: true `的属性，用来告诉编译器，这本来是一个 esm 模块

看一下npm包中react的导出

![](./webpack5-images/shoot2.png)

可以看到通过npm方式引用react时默认是以`commonjs`方式导出的，结合上面ts默认编译的规则，`import React from 'react'` 会从 `exports.default` 上去拿代码，显然此时`default`属性不存在`commonjs`模块中，因此会导致打印`undefined`；而`import * as React from 'react'` 则会把React作为为一个对象，因此不会有问题。

首先对于 [react v16.13.0](https://github.com/facebook/react/blob/v16.12.0/packages/react/src/React.js) 之前的版本都是通过 `export default` 导出的，所以使用 `import React from 'react'` 来导入 react，上面的 console.log(constant) 才不会是 undefined

但是从  [react v16.13.0](https://github.com/facebook/react/blob/v16.13.0/packages/react/src/React.js) 开始，react 就改成了用 `export` 的方式导出了，如果在 ts 中使用 `import React from 'react'` 则会有错误提示：

```
TS1259: Module 'xxxx' has no default export.
```

由于没有了 `default` 属性，所以上面编译后的代码` console.log(constant)` 输出的是 undefined，ts 会提示有错误。

### esModuleInterop 和 allowSyntheticDefaultImports


上面的问题延伸一下，其实不仅仅是引入react，在esm中引入任何commonjs的模块在ts默认编译时都会有这样的问题，ts提供了`esModuleInterop` 和 `allowSyntheticDefaultImports` 这两个配置来影响ts默认的解析。

`allowSyntheticDefaultImports`是一个类型检查的配置，它会把`import`没有`exports.default`的报错忽略，如果你的`target`是`es6`加上这个配置就够了，但如果你的目标代码是`es5`仅仅加上这个还不行，还需要使用`esModuleInterop`，因为它才会改变tsc的编译产物：

```
// tsconfig.json

{
    "compilerOptions": {
      "module": "commonjs",
      "target": "es5",
      "esModuleInterop":true
    }
 }
 
// index.ts
import React from 'react';
console.log(React.useEffect)

// tsc产物
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
console.log(react_1.default.useEffect);
```

在加上`esModuleInterop` 之后编译产物多了一个`_importDefault` 辅助函数，而他的作用就是给`module.exports` 加上`default` 属性。
根据 [ts官网](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports)的说明 开启`esModuleInterop`的同时也会默认开启`allowSyntheticDefaultImports`,因此更推荐直接加`esModuleInterop`。


 - [esModuleInterop 是如何影响 tsc 的](https://juejin.cn/post/7138308695900815373)
ts 中导入一个 CommonJS 模块最佳实践仍然是：

`esModuleInterop=false`，使用 `import * as XX`语法
`esModuleInterop=true`，使用 `import XX from 'XX'`语法

## 项目目录

```markdown
react-ts-template
├── package.json
├── public # 存放html模板
├── script # webpack配置
│ ├── config # 配置文件
│ ├── utils # 
│ ├── webpack.common.ts
│ ├── webpack.development.ts
│ ├── webpack.production.ts
├── README.md
├── src
│ ├── assets # 存放会被 Webpack 处理的静态资源文件：一般是自己写的 js、css 或者图片等静态资源
│ │ ├── fonts # iconfont 目录
│ │ ├── images # 图片资源目录
│ │ ├── css # 全局样式目录
│ │ └── js # 全局js
│ ├── common # 存放项目通用文件
│ ├── components # 项目中通用的组件目录
│ ├── feature # 项目中通用的业务组件目录
│ ├── config # 项目配置文件
│ ├── pages # 项目页面目录
│ ├── typings # 项目中d.ts 声明文件目录
│ ├── types # 项目中声明文件
│ ├── uiLibrary # 组件库
│ ├── routes # 路由目录
│ ├── services # 和后端相关的文件目录
│ ├── store # redux 仓库
│ ├── utils # 全局通用工具函数目录
│ ├── App.tsx # App全局
│ ├── index.tsx # 项目入口文件
│ ├── index.scss # 项目入口引入的scss
└── tsconfig.json # TS 配置文件
└── tsconfig.webpack.json # 给ts-node指定tsconfig-paths时使用
```

## webpack

```shell
pnpm add webpack webpack-cli webpack-dev-server webpack-merge -D
```

这里webpack的配置文件也使用typescript，需要额外配置，参考官网[Configuration Languages](https://webpack.docschina.org/configuration/configuration-languages/)

要使用 Typescript 来编写 webpack 配置，你需要先安装必要的依赖，比如 Typescript 以及其相应的类型声明，类型声明可以从 `DefinitelyTyped` 项目中获取，依赖安装如下所示：

```shell
pnpm add ts-node @types/node @types/webpack -D
```

值得注意的是你需要确保 `tsconfig.json` 的 `compilerOption`s 中 `module` 选项的值为 `commonjs`,否则 webpack 的运行会失败报错，因为 `ts-node` 不支持 `commonjs` 以外的其他模块规范。

官网有三种设置方式，这里选择第三种

先安装 `tsconfig-paths` 这个 npm 包，如下所示：

```shell
pnpm add tsconfig-paths -D
```
然后添加`tsconfig.webpack.json`
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "downlevelIteration": true
  },
  "include": ["webpack"]
}
```
package.json
```json
{
  "scripts": {
    "build": "cross-env TS_NODE_PROJECT=\"tsconfig.webpack.json\" webpack"
  }
}
```
之所以要添加 `cross-env`，是因为我们在直接使用 `TS_NODE_PROJECT` 时遇到过 "TS_NODE_PROJECT" unrecognized command 报错的反馈，添加` cross-env` 之后该问题也似乎得到了解决，可以查看这个[issue](https://github.com/webpack/webpack.js.org/issues/2733)

### 安装相关插件

- html-webpack-plugin: 在webpack构建后生成html文件，同时把构建好入口js等文件引入到生成的html文件中。
- mini-css-extract-plugin：抽取csc为单独的css文件.
- css-minimizer-webpack-plugin： 使用 [cssnano](https://cssnano.co/) 优化和压缩 CSS.
- style-loader: 开发环境选择下使用`style-loader`, 它可以使用多个标签将 CSS 插入到 DOM 中，反应会更快
- css-loader：css-loader 会对 `@import` 和 `url() `进行处理，就像 js 解析 `import/require()` 一样。
- @pmmmwh/react-refresh-webpack-plugin && react-refresh: react热更新
- dotenv：可以将环境变量中的变量从 `.env `文件加载到 `process.env` 中。
- cross-env： 运行跨平台设置和使用环境变量的脚本
- @soda/friendly-errors-webpack-plugin: 用于美化控制台，良好的提示错误。
- fork-ts-checker-webpack-plugin: runs TypeScript type checker on a separate process.
- babel相关，后续单独罗列
- postcss等，后续单独罗列

```shell
pnpm add html-webpack-plugin @pmmmwh/react-refresh-webpack-plugin react-refresh dotenv cross-env mini-css-extract-plugin css-minimizer-webpack-plugin style-loader css-loader @soda/friendly-errors-webpack-plugin fork-ts-checker-webpack-plugin -D
```

### 添加public文件夹

添加index.html

```html
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="icon" href="<%= htmlWebpackPlugin.options.publicPath %>/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="<%= htmlWebpackPlugin.options.description %>"
    />
    <link rel="apple-touch-icon" href="<%= htmlWebpackPlugin.options.publicPath %>/logo192.png" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### webpack中的指纹策略

比如 `filename: '[name].[hash].[ext]'`

- hash：以项目为单位，项目内容改变了，则会生成新的`hash`，内容不变则`hash`不变。 整个工程任何一个需要被打包的文件发生了改变，打包结果中的所有文件的hash值都会改变。
- chunkhash：以`chunk`为单位，当一个文件内容改变，则整个`chunk`组的模块hash都会改变。

比如： 假设打包出口有`a.123.js`和`c.123.js`，a文件中引入了b文件，修改了b文件的内容，重新的打包结果为`a.111.js`和`c.123.js` 的`hash`值会被影响，但是**c的hash值不受影响**。

- contenthash：以自身内容为单位，依赖不算。

比如： 假设打包出口有`a.123.js`和`b.123.css`，a文件引入了b文件，修改了b文件的内容，重新打包结果为`a.123.js`和`b.111.css`，a的hash值不受影响

### 静态资源

webpack 5 之前，通常使用

- raw-loader 将文件导入为字符串
- url-loader 将文件作为data URL 内联到bundle中
- file-loader 将文件发送到输出目录

相比webpack5之前需要`url-loader`、`file-loader`等处理，在webpack5中直接内置了 [`asset`](https://webpack.docschina.org/guides/asset-modules/) 模块，

- `asset/resource`发送一个单独的文件并导出 URL。之前通过使用`file-loader`实现
- `asset/inline` 导出一个资源的 data URI。之前通过使用`url-loader`实现。
- asset/source导出资源的源代码。之前通过使用raw-loader实现。
- asset在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用url-loader，并且配置资源体积限制实现。

关于配置`type:'asset'`后，webpack 将按照默认条件，自动地在 `resource` 和 `inline` 之间进行选择：小于 8kb 的文件，将会视为 `inline` 模块类型，否则会被视为 `resource` 模块类型。

## babel 设置

关于TS转JS，有三种方案
- tsc: 不好配合`webpack`使用，转换`es5`以后，一些语法特性不能转换。
- [ts-loader](https://www.npmjs.com/package/ts-loader): 可以做类型检查，可搭配`tsconfig.json`使用。
- `babel-loader` + `@babel/preset-typescript`, 插件丰富，提供缓存机制，后续兼容扩展更强，但做不了类型检查(可以使用[Fork TS Checker Webpack Plugin](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin)。（推荐）

这里选择第三种，安装依赖：
```shell
pnpm i babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript core-js -D
pnpm i @babel/plugin-transform-runtime -D
pnpm add @babel/runtime
```

- [@babel/preset-env 与@babel/plugin-transform-runtime 使用及场景区别](https://segmentfault.com/a/1190000021188054)
- [babel-loader](https://webpack.docschina.org/loaders/babel-loader): 使用 Babel 和 webpack 转译 JavaScript 等文件，内部核心转译功能需要`@babel/core`这个核心库。
- @babel/core: @babel/core是babel的核心库，所有的核心api都在这个库里，这些api可供`babel-loader`调用
- [@babel/preset-env](https://babel.docschina.org/docs/en/babel-preset-env/): 这是一个预设的插件集合，包含了一组相关的插件，Babel中是通过各种插件来指导如何进行代码转换。该插件包含所有es6转化为es5的翻译规则。可以做到按需加载我们需要的 polyfill

> @babel/prest-env是babel转译过程中的一些预设，它负责将一些基础的es 6+语法，比如const/let...转译成为浏览器可以识别的低级别兼容性语法。这里需要注意的是@babel/prest-env并不会对于一些es6+高版本语法的实现，比如Promise等polyfill，你可以将它理解为语法层面的转化不包含高级别模块(polyfill)的实现。

- @babel/runtime:  is a library that contains Babel modular runtime helpers. preset-env的polyfill会污染全局环境，项目开发可以接受，但做library时最好避免，不应该污染全局，并且应该提供更好的打包体积和效率
- @babel/plugin-transform-runtime: A plugin that enables the re-use of Babel's injected helper code to save on codesize.
    - 当开发者使用异步或生成器的时候，自动引入@babel/runtime/regenerator，开发者不必在入口文件做额外引入；
    - 提供沙盒环境，避免全局环境的污染
    - 移除babel内联的helpers，统一使用@babel/runtime/helpers代替，减小打包体积
- [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react): Babel preset for all React plugins.是一组预设，所谓预设就是内置了一系列babel plugin去转化jsx代码成为我们想要的js代码
- @babel/preset-typescript:这是一个插件，使Babel能够将TypeScript代码转化为JavaScript。
- @babel/polyfill：@babel/preset-env只是提供了语法转换的规则，但是它并不能弥补浏览器缺失的一些新的功能，如一些内置的方法和对象，如Promise，Array.from等，此时就需要polyfill来做js的垫片，弥补低版本浏览器缺失的这些新功能。注意：Babel 7.4.0该包将被废弃
- core-js：它是JavaScript标准库的polyfill，而且它可以实现按需加载。使用@babel/preset-env的时候可以配置core-js的版本和core-js的引入方式。
- regenerator-runtime：提供generator函数的转码

`babel.config.js`
```js
const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: IS_DEV,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [].concat(IS_DEV ? ['react-refresh/babel'] : []),
};

```

### browserslist

browserslist实际上就是声明了一段浏览器的合集，我们的工具可以根据这个合集描述，针对性的输出兼容性代码，browserslist应用于babel、postcss等工具当中。

“> 1%”表示兼容市面上使用量大于百分之一的浏览，“last 1 chrome version”表示兼容到谷歌的上一个版本，具体的可以使用命令npx browserslist "> 1%"的方式查看都包含了哪些浏览器

browserslist可以在`package.json`文件配置，也可以单出写一个`.browserslistrc`文件进行配置。
工具会自动查找`.browserslistrc`中的配置，如果没有发现`.browserslistrc`文件，则会去package.json中查找

```
// 在.browserslistrc中的写法
> 1%
last 2 versions

// 还可以配置不同环境下的规则（在.browserslistrc中）
[production]
> 1%
ie 10

[development]
last 1 chrome version
last 1 firefox version

// 在package.json中的写法
{
  "browserslist": ["> 1%", "last 2 versions"]
}

// 还可以配置不同环境下的规则（在package.json中）
// production和development取决你webpack中mode字段的配置
{
  "browserslist": {
    "production": [
     ">0.2%",
     "not dead",
     "not op_mini all"
    ],
    "development": [
     "last 1 chrome version",
     "last 1 firefox version",
     "last 1 safari version"
    ]
 }
}
```

## postcss

postcss其实就是类似css中的babel的作用，

```shell
pnpm add postcss postcss-loader postcss-preset-env postcss-flexbugs-fixes postcss-normalize -D
```

## eslint, Prettier

[ESLint](https://eslint.org/)是一个前端标准的静态代码检查工具，它可以根据配置的规则来检查代码是否符合规范。


**`plugins` 只是开启了这个插件，而 `extends` 则会继承别人写好的一份 `.eslintrc` 的配置，这份配置不仅仅包括了 `rules` 还有 `parser`，`plugins` 之类的东西。**


**注意：要把 Prettier 的推荐配置 `plugin:prettier/recommended` 放在 `extends` 最后一项。**

[Prettier](https://prettier.io/)是一个代码格式化工具。 ESLint 是通过制定的的规范来检查代码的，这里的 **规范** 有两种：

* 代码风格规范
* 代码质量规范

Prettier 主要负责的是代码风格。

### `extends` vs `plugins`

这一节我想聊聊 ESLint 中 `extends` 和 `plugins` 这两个配置参数的区别，相信这会困扰很多人。

举个例子，假如我们要配置 ESLint x TypeScript，可以看到官网有这样的配置：

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
};
```

神奇的是，当你去掉 `plugins` 之后发现 `eslint` 依然可以正常工作。更神奇的是，只要你写了 `extends`，那么连 `parser` 也可以不用加，要知道没有指定 `parser` 选项，eslint 可看不懂你的 TypeScript 文件。

所以说，到底是 `plugins` 加上了 TypeScript 的能力还是 `extends` 加上了 TypeScript 的规则呢？真让人头大，直到终于有一天受不了了，翻找了一下网上的资料发现了[这个帖子](https://stackoverflow.com/questions/61528185/eslint-extends-vs-plugins-v2020)。

先来说结论吧：**`plugins` 只是开启了这个插件，而 `extends` 则会继承别人写好的一份 `.eslintrc` 的配置，这份配置不仅仅包括了 `rules` 还有 `parser`，`plugins` 之类的东西。**

所以回到问题，为什么在继承了 `plugin:@typescript-eslint/recommended` 之后就可以不写 `plugins` 和 `parser` 呢？因为别人已经把配置都放在 `recommended` 这份配置表里了，这样对使用的人来说，就可以少写很多配置项了。

也就是说，下面两份配置是等价的：

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: [],
  rules: {
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true
      }
    ]
  }
}
```

以及

```js
module.exports = {
  plugins: [],
  extends: ["plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true
      }
    ]
  }
}
```

对于第一份配置：
* 需要手动添加 `parser`, `parserOptions`, `plugins`
* 只开启了 `@typescript-eslint/explicit-function-return-type` 一个规则

对于第二份配置：
* `plugin:@typescript-eslint/recommended` 自动添加了 `parser`, `parserOptions`, `plugins`
* 自动加上一些推荐的 TypeScript 的 ESLint 规则
* 自定义了 `@typescript-eslint/explicit-function-return-type` 规则

```shell
pnpm add prettier -D
pnpm add eslint -D
pnpm add  @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
pnpm add eslint-config-prettier eslint-plugin-prettier -D
pnpm add eslint-plugin-react eslint-plugin-react-hooks -D
pnpm add eslint-plugin-import -D
```
`eslint-plugin-import `


支持 ES2015+ (ES6+) 导入/导出语法的 linting
顾名思义，是对导入的模块进行排序，并防止文件路径和导入名称拼写错误的问题
对比排序前后代码，排序后的代码看起来更整洁，


- [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app)

## lint-stage, husky, commitlint

统一编辑器格式`.editorconfig`
```txt
# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```


`husky`用来绑定 `Git Hooks`,在指定时机（例如 `pre-commit`）执行我们想要的命令，比如可用于提交代码时进行 `eslint` 校验，如果有 `eslint` 报错可阻止代码提交。详细的安装使用方式可参考 [Husky 文档](https://typicode.github.io/husky/#/?id=automatic-recommended)

`lint-staged` 能够让`lint`只检测`git缓存区`的文件，提升速度。

```shell
pnpm add husky lint-staged -D
```

package.json中添加命令

```json
{
  "scripts":{
    "prepare": "husky install & npx only-allow pnpm"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint  --fix"]
  }
}
```
或者
```shell
pnpm i lint-staged husky -D
pnpm set-script prepare "husky install" # 在package.json中添加脚本
pnpm run prepare # 初始化husky,将 git hooks 钩子交由husky执行
```
接着设置你想要的git hooks

Husky 初始化完成后，`pnpm dlx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"`

.husky下会出现文件`commit-msg`如下
```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit 
```
添加 lint-staged
```shell
pnpm dlx husky add .husky/pre-commit "npx --no-install lint-staged" 
```

### 规范代码提交

`@commitlint/config-conventional` `@commitlint/cli` 制定了`git commit`提交规范，团队可以更清晰地查看每一次代码的提交记录

`@commitlint/config-conventional` 这是一个规范配置，标识采用什么规范来执行消息校验, 这个默认是Angular的提交规范


```shell
pnpm add -D @commitlint/config-conventional @commitlint/cli 
```

在项目根目录下创建`commitlint.config.js`

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### 使用commitizen规范commit提交格式

`commitizen` 的作用主要是为了生成标准化的 `commit message`，符合 `Angular` 规范。

一个标准化的 `commit message` 应该包含三个部分：Header、Body 和 Footer，其中的 Header 是必须的，Body 和 Footer 可以选填。

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

Header 部分由三个字段组成：type（必需）、scope（可选）、subject（必需）

- Type
  `type` 必须是下面的其中之一：
    - feat: 增加新功能
    - fix: 修复 bug
    - docs: 只改动了文档相关的内容
    - style: 不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
    - refactor: 代码重构时使用，既不是新增功能也不是代码的bud修复
    - perf: 提高性能的修改
    - test: 添加或修改测试代码
    - build: 构建工具或者外部依赖包的修改，比如更新依赖包的版本
    - ci: 持续集成的配置文件或者脚本的修改
    - chore: 杂项，其他不需要修改源代码或不需要修改测试代码的修改
    - revert: 撤销某次提交

- scope

用于说明本次提交的影响范围。`scope` 依据项目而定，例如在业务项目中可以依据菜单或者功能模块划分，如果是组件库开发，则可以依据组件划分。

- subject

主题包含对更改的简洁描述：

注意三点：

1. 使用祈使语气，现在时，比如使用 "change" 而不是 "changed" 或者 ”changes“
2. 第一个字母不要大写
3. 末尾不要以.结尾

- Body

主要包含对主题的进一步描述，同样的，应该使用祈使语气，包含本次修改的动机并将其与之前的行为进行对比。

- Footer

包含此次提交有关重大更改的信息，引用此次提交关闭的issue地址，如果代码的提交是不兼容变更或关闭缺陷，则Footer必需，否则可以省略。

使用方法：

如果需要在项目中使用 `commitizen` 生成符合 `AngularJS` 规范的提交说明，还需要安装 `cz-conventional-changelog` 适配器。
```shell
pnpm i commitizen cz-conventional-changelog -D
```

安装指令和命令行的展示信息
```shell
pnpm set-script commit "git-cz" # package.json 中添加 commit 指令, 执行 `git-cz` 指令
```
初始化commit指令(可能出错)
```shell
pnpm dlx commitizen init cz-conventional-changelog --save-dev --save-exact
```
或者直接在package.json添加
```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```
接下来就可以使用 `$ pnpm commit` 来代替 `$ git commit` 进行代码提交了，看到下面的效果就表示已经安装成功了。


也可以自定义提交规范，`cz-conventional-changelog`就可以移除了
```shell
pnpm i commitlint-config-cz  cz-customizable -D
```
增加 `.cz-config.js`如下
并修改配置：
```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
}
```
官方[example](https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js)
```shell
"use strict";
module.exports = {
  types: [
    { value: "✨新增", name: "新增:    新的内容" },
    { value: "🐛修复", name: "修复:    修复一个Bug" },
    { value: "📝文档", name: "文档:    变更的只有文档" },
    { value: "💄格式", name: "格式:    空格, 分号等格式修复" },
    { value: "♻️重构", name: "重构:    代码重构，注意和特性、修复区分开" },
    { value: "⚡️性能", name: "性能:    提升性能" },
    { value: "✅测试", name: "测试:    添加一个测试" },
    { value: "🔧工具", name: "工具:    开发工具变动(构建、脚手架工具等)" },
    { value: "⏪回滚", name: "回滚:    代码回退" }
  ],
  scopes: [
    { name: "javascript" },
    { name: "typescript" },
    { name: "react" },
    { name: "test" }
    { name: "node" }
  ],
  // it needs to match the value for field type. Eg.: 'fix'
  /*  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },  */
  // override the messages, defaults are as follows
  messages: {
    type: "选择一种你的提交类型:",
    scope: "选择一个scope (可选):",
    // used if allowCustomScopes is true
    customScope: "Denote the SCOPE of this change:",
    subject: "短说明:\n",
    body: "长说明，使用\"|\"换行(可选)：\n",
    breaking: "非兼容性说明 (可选):\n",
    footer: "关联关闭的issue，例如：#31, #34(可选):\n",
    confirmCommit: "确定提交说明?(yes/no)"
  },
  allowCustomScopes: true,
  allowBreakingChanges: ["特性", "修复"],
  // limit subject length
  subjectLimit: 100
};
```


## analyze

```shell
webpack --profile --json > stats.json
pnpm i webpack-bundle-analyzer -g 
webpack-bundle-analyzer stats.json 
```


## [optimization.runtimeChunk](https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk)

将 optimization.runtimeChunk 设置为 `true` 或 'multiple'，会为每个入口添加一个只含有 runtime 的额外 chunk。此配置的别名如下：

webpack.config.js

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
};
```
运行时的chunk文件，形如`import('abc').then(res=>{})`这种异步加载的代码，在webpack中即为运行时代码。比如这样异步引入一个组件：
```tsx
const Button = React.lazy(
  () => import(/* webpackChunkName: "Button" */ './components/Button')
);
```
如果不设置runtimeChunk，默认是false，第一次打包：
![](./webpack5-images/noruntime-1.png)

修改Button组件后打包:
![](./webpack5-images/noruntime-2.png)

可以看到入口文件main的hash也变了。而我们明明只改了button组件。

可设置runtimeChunk为true
>设置runtimeChunk是将包含chunks 映射关系的 list单独从 main.js里提取出来，因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以每次改动都会影响它，如果不将它提取出来的话，等于 main.js每次都会改变。缓存就失效了。设置runtimeChunk之后，webpack就会生成一个个`runtime~xxx.js`的文件。
然后每次更改所谓的运行时代码文件时，打包构建时 main.js的hash值是不会改变的。如果每次项目更新都会更改 main.js的hash值，那么用户端浏览器每次都需要重新加载变化的app.js，如果项目大切优化分包没做好的话会导致第一次加载很耗时，导致用户体验变差。现在设置了runtimeChunk，就解决了这样的问题。所以这样做的目的是避免文件的频繁变更导致浏览器缓存失效，所以其是更好的利用缓存。提升用户体验。


但是这样又有一个问题，runtime.js size很小，如果chunk有变化，这个文件每次构建都会变，多个一个http请求。每次重新构建上线后，浏览器每次都需要重新请求它，它的 http 耗时远大于它的执行时间了，所以建议不要将它单独拆包，而是将它内联到我们的 index.html 之中.

可使用插件[script-ext-html-webpack-plugin](https://www.npmjs.com/package/script-ext-html-webpack-plugin)解决。但这个插件虽然能用，但和webpack5不兼容了。可以使用插件[hwp-inline-runtime-chunk-plugin](https://www.npmjs.com/package/hwp-inline-runtime-chunk-plugin)代替。
```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: true,
  },
  plugins: [
      // ...
    new ScriptExtHtmlWebpackPlugin({
      inline: /runtime~.+\.js$/,
    }),
  ]
};
```

## [tree-shaking](https://webpack.js.org/guides/tree-shaking/#root)

在 Webpack 中，启动 Tree Shaking 功能必须同时满足三个条件：

- 使用 ESM 规范编写模块代码(`import` and` `export`)
- 配置 `optimization.usedExports` 为 true（默认值），启动标记功能
- 启动代码优化功能，可以通过如下方式实现：
    - 配置 `mode = production `
    - 配置 `optimization.minimize = true `（默认值）
    - 提供 [`optimization.minimizer`](https://webpack.js.org/configuration/optimization/#optimizationminimizer) 数组, 注入 `Terser`（minimize为true时如果不覆盖选项，默认启用，覆盖了要单独引入使用）、`UglifyJS` 插件

sideEffects

`usedExports`是检查上下文有没有引用，如果没有引用，就会注入魔法注释，通过`terser`压缩进行去除未引入的代码

而`sideEffects`是对没有副作用的代码进行去除

css tree shaking

https://blog.csdn.net/pfourfire/article/details/126505335
```js
// webpack.config.js
module.exports = {
  entry: "./src/index",
  mode: "production",
  devtool: false,
  optimization: {
    usedExports: true,
  },
};
```

### webpack-bundle-analyzer

每个打包以后的 bundle 文件里面，真正包含哪些内容，项目里的 module、js、component、html、css、img 最后都被放到哪个对应的 bunlde 文件里了。

每个 bundle 文件里，列出了每一个的 module、componet、js 具体 size，同时会列出 start size、parsed size、gzip size 这三种不同的形式下到底多大，方便优化。

- start size：原始没有经过 minify 处理的文件大小

- parse size：比如 webpack plugin 里用了 uglify，就是 minified 以后的文件大小

- gzip size：被压缩以后的文件大小


- [Eslint + Prettier + Husky + Commitlint+ Lint-staged 规范前端工程代码规范](https://juejin.cn/post/7038143752036155428)
- [爆肝从零搭建React+webpack5+Typescript模板](https://juejin.cn/post/7020972849649156110)
- [Module Resolution or Import Alias: The Final Guide](https://www.raulmelo.dev/blog/module-resolution-or-import-alias-the-final-guide)
- [Webpack 原理系列九：Tree-Shaking 实现原理](https://segmentfault.com/a/1190000040814997)
- [Configuring aliases in webpack + VS Code + Typescript + Jest](https://www.basefactor.com/configuring-aliases-in-webpack-vs-code-typescript-jest)
