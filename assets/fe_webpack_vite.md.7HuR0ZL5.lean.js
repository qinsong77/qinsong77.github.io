import{_ as a,c as s,a2 as e,o as t}from"./chunks/framework.BQmytedh.js";const l="/assets/webpack_bundle_server.DfTndWO_.png",p="/assets/vite2.BmtMWqYh.png",u=JSON.parse('{"title":"Vite","description":"","frontmatter":{},"headers":[],"relativePath":"fe/webpack/vite.md","filePath":"fe/webpack/vite.md","lastUpdated":1713365822000}'),o={name:"fe/webpack/vite.md"};function n(r,i,h,d,c,k){return t(),s("div",null,i[0]||(i[0]=[e('<h1 id="vite" tabindex="-1">Vite <a class="header-anchor" href="#vite" aria-label="Permalink to &quot;Vite&quot;">​</a></h1><p>webpack 慢：</p><ol><li>随着项目大小增长，项目冷启动时间指数增长：因为需要递归的处理识别模块生成依赖图，并且代码拆分异步应用，也需要一次生成所有路由下的编译后文件。</li><li>热更新时间也会随着项目大小增大而增长： Webpack 的热更新会以当前修改的文件为入口重新 build 打包，所有涉及到的依赖也都会被重新加载一次。</li></ol><h3 id="为什么-webpack-这么慢" tabindex="-1">为什么 Webpack 这么慢 <a class="header-anchor" href="#为什么-webpack-这么慢" aria-label="Permalink to &quot;为什么 Webpack 这么慢&quot;">​</a></h3><p>本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器（module bundler）。</p><p>运行启动命令的时候，webpack 总是需要从入口文件去索引整个项目的文件，编译成一个或多个单独的 js 文件，<strong>即使采用了代码拆分，也需要一次生成所有路由下的编译后文件</strong>（这也是为什么代码拆分对开发模式性能没有帮助）。这也导致了服务启动时间随着项目复杂度而指数增长</p><p>webpack 打包过程</p><ol><li>识别入口文件</li><li>通过逐层识别模块依赖。（Commonjs、amd 或者 es6 的 import，webpack 都会对其进行分析。来获取代码的依赖）</li><li>webpack 做的就是分析代码。转换代码，编译代码，输出代码</li><li>最终形成打包后的代码</li></ol><p>webpack 打包原理</p><ol><li>先逐级递归识别依赖，构建依赖图谱</li><li>将代码转化成 AST 抽象语法树</li><li>在 AST 阶段中去处理代码</li><li>把 AST 抽象语法树变成浏览器可以识别的代码， 然后输出</li></ol><p>重点:需要<strong>递归识别依赖，构建依赖图谱</strong>。</p><p><img src="'+l+'" alt=""></p><p><strong>Webpack 的热更新会以当前修改的文件为入口重新 build 打包，所有涉及到的依赖也都会被重新加载一次。</strong></p><h2 id="vite-1" tabindex="-1">vite <a class="header-anchor" href="#vite-1" aria-label="Permalink to &quot;vite&quot;">​</a></h2><p>基于<code>esbuild</code>与<code>Rollup</code>，依靠浏览器自身 ESM 编译功能， 实现极致开发体验的新一代构建工具</p><h3 id="vite-特点" tabindex="-1">vite 特点 <a class="header-anchor" href="#vite-特点" aria-label="Permalink to &quot;vite 特点&quot;">​</a></h3><ol><li>快速的冷启动</li><li>即时的模块热更新</li><li>真正的按需编译</li></ol><p><img src="'+p+`" alt=""></p><h3 id="原理" tabindex="-1">原理 <a class="header-anchor" href="#原理" aria-label="Permalink to &quot;原理&quot;">​</a></h3><ul><li><a href="https://mp.weixin.qq.com/s/ejkfARh6hlOAUnw5Eadb6Q" target="_blank" rel="noreferrer">Vite 的实现原理</a></li><li><a href="https://juejin.cn/post/6931618997251080200" target="_blank" rel="noreferrer">文章</a></li></ul><p>当声明一个 script 标签类型为 module 时如：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;module&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> src</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/src/main.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>浏览器就会像服务器发起一个 GET 请求<code>http://localhost:3000/src/main.js</code>请求 main.js 文件：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// /src/main.js:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { createApp } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> App </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./App.vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(App).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;#app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>浏览器请求到了 main.js 文件，检测到内部含有 import 引入的包，又会对其内部的 import 引用发起 HTTP 请求获取模块的内容文件</p><p>如：GET <code>http://localhost:3000/@modules/vue.js</code></p><p>如：GET <code>http://localhost:3000/src/App.vue</code></p><p>Vite 的主要功能就是通过劫持浏览器的这些请求，并在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器，vite 整个过程中没有对文件进行打包编译，所以其运行速度比原始的 webpack 开发编译速度快出许多</p><h4 id="依赖预构建与缓存" tabindex="-1">依赖预构建与缓存 <a class="header-anchor" href="#依赖预构建与缓存" aria-label="Permalink to &quot;依赖预构建与缓存&quot;">​</a></h4><p>原生 ES 引入不支持下面这样的裸模块导入：</p><p>上面的操作将在浏览器中抛出一个错误。Vite 将在服务的所有源文件中检测此类裸模块导入，并执行以下操作:</p><ol><li><strong>预构建</strong> 他们以提升页面重载速度，并将 CommonJS / UMD 转换为 ESM 格式。预构建这一步由 esbuild 执行，这使得 Vite 的冷启动时间比任何基于 javascript 的打包程序都要快得多。</li></ol><p>在<strong>开发阶段</strong>中， Vite 的开发服务器将所有的代码都视为原生 ES 模块，所以需要在预构建阶段先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。</p><p>Vite 将带有许多内部模块的 ESM 依赖转换为单个模块，以提高后续页面加载性能（降低请求数量），比如 lodash-es 有超过 600 个内置模块，一次性发送 600 多个 http 请求，就算是采用了 HTTP2 也是不可接受的，大量的网络请求在浏览器端会造成网络拥塞，导致页面的加载速度相当慢，通过预构建 lodash-es 成为一个模块，就只需要一个 HTTP 请求了！</p><p>预构建完依赖项之后，再使用 <code>es-module-lexer + magic-string</code> 进行轻量级裸模块导入语句的重写。因为并没有进行完整的 AST 遍历，所以速度非常快，对于大多数文件来说这个时间都小于 1ms</p><ol start="2"><li><p><strong>重写导入为合法的 URL</strong>，例如 /node_modules/.vite/my-dep.js?v=f3sf2ebd 以便浏览器能够正确导入它们。</p></li><li><p>Vite 会将预构建的依赖缓存到 node_modules/.vite 路径下，可以看到文件名后跟着一串随机字符串，使用 http 强缓存策略，<code>Cache-Control</code> 属性被写为了： <code>max-age=31536000,immutable</code></p></li></ol><h4 id="esbuild-转换文件" tabindex="-1">esbuild 转换文件 <a class="header-anchor" href="#esbuild-转换文件" aria-label="Permalink to &quot;esbuild 转换文件&quot;">​</a></h4><p>包括将 CommonJS / UMD 转换为 ESM 格式，转换 ts, tsc 文件等</p><ol><li>使用 Go 编写，并且编译成了机器码</li><li>大量使用并行算法</li><li>esbuild 的所有内容都是从零编写的</li><li>更有效利用内存</li></ol><h4 id="模块热重载" tabindex="-1">模块热重载 <a class="header-anchor" href="#模块热重载" aria-label="Permalink to &quot;模块热重载&quot;">​</a></h4><p>Vite 提供了一套原生 ESM 的 <code>HMR API</code>。 具有 HMR 功能的框架可以利用该 API 提供即时、准确的更新，而无需重新加载页面或删除应用程序状态。Vite 提供了第一优先级的 HMR 集成给 <code>Vue 单文件组件（SFC）</code> 和 <code>React Fast Refresh</code>。</p><ol><li><p>在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失效（大多数时候只需要模块本身），使 HMR 更新始终快速，无论应用的大小。</p></li><li><p>Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求。</p></li></ol><ul><li><a href="https://mp.weixin.qq.com/s/oroQSMSPxtSEfnjuxu2pew" target="_blank" rel="noreferrer">Vite（原理源码解析）</a></li></ul>`,43)]))}const g=a(o,[["render",n]]);export{u as __pageData,g as default};