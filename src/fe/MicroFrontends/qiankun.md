---
title: QianKun
---


![](./image/qiankun2.png)

`qiankun` 是基于 `single-spa` 做的二次封装。single-spa很好地解决了路由和应用入口两个问题，但并没有解决应用加载问题，而是将该问题暴露出来由使用者实现（一般可以用system.js或原生script标签来实现）（system.js：通用的模块加载器，在浏览器端实现对 CommonJS、AMD、UMD 等各种模块的加载。）；
`qiankun`在此基础上封装了一个应用加载方案（即`import-html-entry`），并给出了`js隔离`、`css样式隔离`和`应用间通信`三个问题的解决方案，同时提供了`预加载`功能。

`single-spa`必须手动实现应用加载逻辑，挨个罗列子应用需要加载的资源，这在大型项目里是十分困难的（特别是使用了文件名hash时）；另外它只能以js文件为入口，无法直接以html为入口，这使得嵌入子应用变得很困难，也正因此，single-spa不能直接加载jQuery应用。
## 特性

#### HTML Entry
qiankun 通过 HTML Entry 的方式来解决 JS Entry 带来的问题，让你接入微应用像使用 iframe 一样简单。


#### 样式隔离
qiankun 实现了两种样式隔离

- 严格的样式隔离模式，为每个微应用的容器包裹上一个 shadow dom 节点，从而确保微应用的样式不会对全局造成影响
- 实验性的方式，通过动态改写 css 选择器来实现，可以理解为 css scoped 的方式



#### 运行时沙箱
qiankun 的运行时沙箱分为 `JS 沙箱`和 `样式沙箱`
-JS 沙箱 为每个微应用生成单独的 window proxy 对象，配合 HTML Entry 提供的 JS 脚本执行器 (execScripts) 来实现 JS 隔离；
- 样式沙箱 通过重写 DOM 操作方法，来劫持动态样式和 JS 脚本的添加，让样式和脚本添加到正确的地方，即主应用的插入到主应用模版内，微应用的插入到微应用模版，并且为劫持的动态样式做了 scoped css 的处理，为劫持的脚本做了 JS 隔离的处理，更加具体的内容可继续往下阅读或者直接阅读 微前端专栏 中的 qiankun 2.x 运行时沙箱 源码分析


#### 资源预加载
qiankun 实现预加载的思路有两种，一种是当主应用执行 start 方法启动 qiankun 以后立即去预加载微应用的静态资源，另一种是在第一个微应用挂载以后预加载其它微应用的静态资源，这个是利用 single-spa 提供的 single-spa:first-mount 事件来实现的


#### 应用间通信
qiankun 通过`发布订阅模式`来实现应用间通信，状态由框架来统一维护，每个应用在初始化时由框架生成一套通信方法，应用通过这些方法来更改全局状态和注册回调函数，全局状态发生改变时触发各个应用注册的回调函数执行，将新旧状态传递到所有应用


## 原理

## 应用加载

### 沙箱实现原理

qiankun 的JS沙箱隔离主要分为三种：

- legacySandBox
- proxySandBox
- snapshotSandBox。

其中 legacySandBox、proxySandBox 是基于 `Proxy API` 来实现的，在不支持 `Proxy API` 的低版本浏览器中，会降级为 snapshotSandBox。在现版本中，legacySandBox 仅用于 singular 单实例模式，而多实例模式会使用 proxySandBox。

#### legacySandBox

legacySandBox 的本质上还是操作 window 对象，但是他会存在三个状态池，分别用于子应用卸载时还原主应用的状态和子应用加载时还原子应用的状态：

- addedPropsMapInSandbox： 存储在子应用运行时期间新增的全局变量，用于卸载子应用时还原主应用全局变量；
- modifiedPropsOriginalValueMapInSandbox：存储在子应用运行期间更新的全局变量，用于卸载子应用时还原主应用全局变量；
- currentUpdatedPropsValueMap：存储子应用全局变量的更新，用于运行时切换后还原子应用的状态；

总结起来，legacySandBox 还是**会操作 `window` 对象**，但是他通过激活沙箱时还原子应用的状态，卸载时还原主应用的状态来实现沙箱隔离的。

![](./image/legancySandbox.png)

```typescript
const rawWindow = window;
const fakeWindow = Object.create(null) as Window;
// 创建对fakeWindow的劫持，fakeWindow就是我们传递给自执行函数的window对象
const proxy = new Proxy(fakeWindow, {
  set(_: Window, p: PropertyKey, value: any): boolean {
    // 运行时的判断
    if (sandboxRunning) {
      // 如果window对象上没有这个属性，那么就在状态池中记录状态的新增；
      if (!rawWindow.hasOwnProperty(p)) {
        addedPropsMapInSandbox.set(p, value);
 
        // 如果当前 window 对象存在该属性，并且状态池中没有该对象，那么证明改属性是运行时期间更新的值，记录在状态池中用于最后window对象的还原
      } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
        const originalValue = (rawWindow as any)[p];
        modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
      }
 
      // 记录全局对象修改值，用于后面子应用激活时还原子应用
      currentUpdatedPropsValueMap.set(p, value);
      (rawWindow as any)[p] = value;
 
      return true;
    }
 
    return true;
  },
 
  get(_: Window, p: PropertyKey): any {
    // iframe的window上下文
    if (p === "top" || p === "window" || p === "self") {
      return proxy;
    }
 
    const value = (rawWindow as any)[p];
    return getTargetValue(rawWindow, value);
  },
});
```
子应用沙箱的激活 / 卸载：

```typescript
 // 子应用沙箱激活
  active() {
    // 通过状态池，还原子应用上一次写在前的状态
    if (!this.sandboxRunning) {
      this.currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v));
    }
 
    this.sandboxRunning = true;
  }
 
  // 子应用沙箱卸载
  inactive() {
    // 还原运行时期间修改的全局变量
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => setWindowProp(p, v));
    // 删除运行时期间新增的全局变量
    this.addedPropsMapInSandbox.forEach((_, p) => setWindowProp(p, undefined, true));
 
    this.sandboxRunning = false;
  }
```

```typescript
// 子应用脚本文件的执行过程：
eval(
  // 这里将 proxy 作为 window 参数传入
  // 子应用的全局对象就是该子应用沙箱的 proxy 对象
  (function(window) {
    /* 子应用脚本文件内容 */
  })(proxy)
);
```

#### proxySandBox

proxySandBox 用于多实例场景。和 legacySandBox 最直接的不同点就是，为了支持多实例的场景，**proxySandBox 不会直接操作 `window` 对象**。并且为了避免子应用操作或者修改主应用上诸如 window、document、location 这些重要的属性，会遍历这些属性到子应用 window 副本（`fakeWindow`）上。

创建子应用 `window` 的副本：

```typescript

function createFakeWindow(global: Window) {
  // 在has和check的场景下，map有着更好的性能
  const propertiesWithGetter = new Map<PropertyKey, boolean>();
  const fakeWindow = {} as FakeWindow;
 
  // 从window对象拷贝不可配置的属性
  // 举个例子：window、document、location这些都是挂在Window上的属性，他们都是不可配置的
  // 拷贝出来到fakeWindow上，就间接避免了子应用直接操作全局对象上的这些属性方法
  Object.getOwnPropertyNames(global)
    .filter((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      // 如果属性不存在或者属性描述符的configurable的话
      return !descriptor?.configurable;
    })
    .forEach((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      if (descriptor) {
        // 判断当前的属性是否有getter
        const hasGetter = Object.prototype.hasOwnProperty.call(
          descriptor,
          "get"
        );
 
        // 为有getter的属性设置查询索引
        if (hasGetter) propertiesWithGetter.set(p, true);
 
        // freeze the descriptor to avoid being modified by zone.js
        // zone.js will overwrite Object.defineProperty
        // const rawObjectDefineProperty = Object.defineProperty;
        // 拷贝属性到fakeWindow对象上
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
      }
    });
 
  return {
    fakeWindow,
    propertiesWithGetter,
  };
}
```

proxySandBox 的 getter/setter：

```typescript
const rawWindow = window;
// window副本和上面说的有getter的属性的索引
const { fakeWindow, propertiesWithGetter } = createFakeWindow(rawWindow);

const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();
const hasOwnProperty = (key: PropertyKey) =>
  fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);

const proxy = new Proxy(fakeWindow, {
  set(target: FakeWindow, p: PropertyKey, value: any): boolean {
    if (sandboxRunning) {
      // 在fakeWindow上设置属性值
      target[p] = value;
      // 记录属性值的变更
      updatedValueSet.add(p);

      // SystemJS属性拦截器
      interceptSystemJsProps(p, value);

      return true;
    }

    // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
    return true;
  },

  get(target: FakeWindow, p: PropertyKey): any {
    if (p === Symbol.unscopables) return unscopables;

    // 避免window.window 或 window.self 或window.top 穿透sandbox
    if (p === "top" || p === "window" || p === "self") {
      return proxy;
    }

    if (p === "hasOwnProperty") {
      return hasOwnProperty;
    }

    // 批处理场景下会有场景使用，这里就不多赘述了
    const proxyPropertyGetter = getProxyPropertyGetter(proxy, p);
    if (proxyPropertyGetter) {
      return getProxyPropertyValue(proxyPropertyGetter);
    }

    // 取值
    const value = propertiesWithGetter.has(p)
      ? (rawWindow as any)[p]
      : (target as any)[p] || (rawWindow as any)[p];
    return getTargetValue(rawWindow, value);
  },

});
```
因为 proxySandBox 不直接操作 window，所以在激活和卸载的时候也不需要操作状态池更新 / 还原主子应用的状态了。相比较看来，proxySandBox 是现阶段 qiankun 中最完备的沙箱模式，完全隔离了主子应用的状态，不会像 legacySandBox 模式下在运行时期间仍然会污染 window。


#### snapshotSandBox

在不支持 Proxy 的场景下会降级为 snapshotSandBox，snapshotSandBox 的原理就是在子应用激活 / 卸载时分别去通过快照的形式记录/还原状态来实现沙箱的。

![](./image/snapshot.png)

![](./image/snapshotProcess.png)

## 样式隔离

qiankun 的样式隔离有两种方式，一种是严格样式隔离，通过 `shadow dom` 来实现，另一种是实验性的样式隔离，就是 `scoped css`，两种方式不可共存


#### 严格样式隔离


在 qiankun 中的严格样式隔离，就是在 `createElement` 方法中做的，通过 `shadow dom` 来实现， `shadow dom` 是浏览器原生提供的一种能力，
在过去的很长一段时间里，浏览器用它来封装一些元素的内部结构。以一个有着默认播放控制按钮的 `<video>` 元素为例，实际上，在它的 `Shadow DOM` 中，包含来一系列的按钮和其他控制器。
`Shadow DOM` 标准允许你为你自己的元素（`custom element`）维护一组 `Shadow DOM`。

![](./image/strictStyleIsolation.png)

```typescript
/**
 * 做了两件事
 *  1、将 appContent 由字符串模版转换成 html dom 元素
 *  2、如果需要开启严格样式隔离，则将 appContent 的子元素即微应用的入口模版用 shadow dom 包裹起来，达到样式严格隔离的目的
 * @param appContent = `<div id="__qiankun_microapp_wrapper_for_${appInstanceId}__" data-name="${appName}">${template}</div>`
 * @param strictStyleIsolation 是否开启严格样式隔离
 */
function createElement(appContent: string, strictStyleIsolation: boolean): HTMLElement {
  // 创建一个 div 元素
  const containerElement = document.createElement('div');
  // 将字符串模版 appContent 设置为 div 的innerHTML
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div，appContent 由模版字符串变成了 DOM 元素
  const appElement = containerElement.firstChild as HTMLElement;
  // 如果开启了严格的样式隔离，则将 appContent 的子元素（微应用的入口模版）用 shadow dom 包裹，以达到微应用之间样式严格隔离的目的
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn(
        '[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!',
      );
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = '';
      let shadow: ShadowRoot;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = (appElement as any).createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }

  return appElement;
}

```
#### 实验性样式隔离

设置`experimentalStyleIsolation: true`
实验性样式的隔离方式其实就是 `scoped css`，qiankun 会通过动态改写一个特殊的选择器约束来限制 `css` 的生效范围，应用的样式会按照如下模式改写：

![](./image/experimentalStyleIsolation.png)

```css
/** 假设应用名是 react16 **/
.app-main {
  font-size: 14px;
}
div[data-qiankun-react16] .app-main {
  font-size: 14px;
}
```
process
````typescript
/**
 * 做了两件事：
 *  实例化 processor = new ScopedCss()，真正处理样式选择器的地方
 *  生成样式前缀 `div[data-qiankun]=${appName}`
 * @param appWrapper = <div id="__qiankun_microapp_wrapper_for_${appInstanceId}__" data-name="${appName}">${template}</div>
 * @param stylesheetElement = <style>xx</style>
 * @param appName 微应用名称
 */
export const process = (
  appWrapper: HTMLElement,
  stylesheetElement: HTMLStyleElement | HTMLLinkElement,
  appName: string,
) => {
  // lazy singleton pattern，单例模式
  if (!processor) {
    processor = new ScopedCSS();
  }

  // 目前支持 style 标签
  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  // 微应用模版
  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }

  // div
  const tag = (mountDOM.tagName || '').toLowerCase();

  if (tag && stylesheetElement.tagName === 'STYLE') {
    // 生成前缀 `div[data-qiankun]=${appName}`
    const prefix = `${tag}[${QiankunCSSRewriteAttr}="${appName}"]`;
     /**
     * 实际处理样式的地方
     * 拿到样式节点中的所有样式规则，然后重写样式选择器
     *  含有根元素选择器的情况：用前缀替换掉选择器中的根元素选择器部分，
     *  普通选择器：将前缀插到第一个选择器的后面
     */
    processor.process(stylesheetElement, prefix);
  }
}


````
采用一定的编程约束：

- 尽量不要使用可能冲突全局的 class 或者直接为标签定义样式；
- 定义唯一的 class 前缀，现在的项目都是用诸如 antd 这样的组件库，这类组件库都支持自定义组件 class 前缀；
- 主应用一定要有自定义的 class 前缀；

在主应用中为每一个子应用，分配一个唯一标识的div， 子应用渲染到对应的div下， 子应用在编译时，通过postcss,统一添加 div 的 id 前辍

## `__INJECTED_PUBLIC_PATH_BY_QIANKUN__`

`__INJECTED_PUBLIC_PATH_BY_QIANKUN__`这个变量是子应用配置的entry的域名路径，如`entry`的路径是`www.test.com/subapp/device`，他的值是`www.test.com/subapp/`，而
是`www.test.com/subapp/device/`的话，值就是`entry`，即`www.test.com/subapp/device/`。

末尾带不带`/`的影响。

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

  // The require `function`
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

```

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

## 如何在一个子应用中复用另一个子应用的页面

如果是使用umi脚手架，`plugin-qiankun` 提供了一个组件 `MicroAppWithMemoHistory` ，该组件可以在运行时，修改子应用为 `memory` 路由。

借助`loadMicroApp`单独加载一个子应用的页面，在主应用将这个函数传给子应用，子应用在乾坤的声明周期函数中接受并挂载到`vue.prototype`
子应用的比如弹窗中调用这个api，加载另一个的子应用页面，另一个子应用要如果是vue, 要`vue-router` 使用不依赖浏览器的 url 的`abstract` 模式(VueRouter内部使用数组进行模拟了路由管理)，并`push`相应的路由path，
另外还要做其他处理，如mixin中的激活菜单处理等。`react-router` 使用 `memory history` 模式
```javascript
export default {
    // ...
    mounted () {
      this.microApp = this.loadMicroApp(
        {
          name: 'asset',
          entry: 'http://172.20.225.66:8083/ops/asset',
          container: '#asset-container',
          props: {
            // store: this.$appStore,
            ifAbstract: true,
            path: '/asset'
          }
        }, {
          singular: false // 重要
        })
      console.log(this.microApp)
    },
    beforeDestroy () {
      this.microApp && this.microApp.unmount()
    },
    // ...
}
```
