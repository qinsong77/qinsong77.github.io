import{_ as i,c as a,a2 as e,o as n}from"./chunks/framework.BQmytedh.js";const t="/assets/shadcn_base_infa_design.CA5kjBhk.png",u=JSON.parse('{"title":"组件库设计","description":"","frontmatter":{"title":"组件库设计"},"headers":[],"relativePath":"fe/frameWork/component_library_design.md","filePath":"fe/frameWork/component_library_design.md","lastUpdated":1732467123000}'),l={name:"fe/frameWork/component_library_design.md"};function h(r,s,p,o,k,d){return n(),a("div",null,s[0]||(s[0]=[e(`<ul><li><a href="https://www.jianshu.com/p/81128ab478e9" target="_blank" rel="noreferrer">面试官: 写过『通用前端组件』吗?</a></li><li><a href="https://juejin.cn/post/6913788953971654663" target="_blank" rel="noreferrer">使用mono-repo实现跨项目组件共享</a></li><li><a href="https://mp.weixin.qq.com/s/DUDnzQWgcdrKAJeMwsmZBw" target="_blank" rel="noreferrer">前端业务组件库怎么样做到极致</a></li></ul><h2 id="前端组件库的设计原则" tabindex="-1">前端组件库的设计原则 <a class="header-anchor" href="#前端组件库的设计原则" aria-label="Permalink to &quot;前端组件库的设计原则&quot;">​</a></h2><h3 id="细粒度的考量" tabindex="-1">细粒度的考量 <a class="header-anchor" href="#细粒度的考量" aria-label="Permalink to &quot;细粒度的考量&quot;">​</a></h3><p>从软件的设计模式上，确定组件的<strong>单一职责原则</strong>，原则上一个组件只专注一件事情，单一职责的组件的好处很明显，由于职责单一就可以最大可能性地<strong>复用</strong>组件。保证组件单一的最大好处<strong>就是方便单元测试</strong>。 同时要考虑划分过细而导致<strong>组件碎片化</strong>的问题。</p><h3 id="通用性考量" tabindex="-1">通用性考量 <a class="header-anchor" href="#通用性考量" aria-label="Permalink to &quot;通用性考量&quot;">​</a></h3><p>组件的形态(DOM结构)永远是千变万化的,但是其行为(逻辑)是固定的,因此通用组件的秘诀之一就是将 DOM 结构的控制权交给开发者,组件只负责行为和最基本的 DOM 结构。</p><p>预留合适的api，或者叫pros等，比如提供自定义渲染render，提过组件核心能力的同事也能根据业务上进行扩展。</p><h3 id="原子性设计" tabindex="-1">原子性设计 <a class="header-anchor" href="#原子性设计" aria-label="Permalink to &quot;原子性设计&quot;">​</a></h3><p>比如样式主题，在<code>sketch</code>文件中将最小颗粒度“原子(如颜色)”按照其使用意图作为名称进行命名；颗粒度再复杂一级的“分子(如字体)”变量名则由<code>typeface/weight/color/size</code>的组合排列产生。</p><h3 id="控制反转设计ioc" tabindex="-1">控制反转设计IOC <a class="header-anchor" href="#控制反转设计ioc" aria-label="Permalink to &quot;控制反转设计IOC&quot;">​</a></h3><p>不是从上层开始使用底层构建或者组装依赖。而是从底层开始设计叠加，感觉有点像是从递归到动态规划的过程。比较明显的一个就是React中的高阶组件（HOC）</p><hr><p>基于<code>Sketch</code>中的symbol功能，前端也需要将组件进行原子化，并根据<code>symbol</code>的变量命名将常用的大小、颜色创建为变量。</p><p>前端组件根据功能以及颗粒度可以分为“基础组件”和“高阶组件”。基础组件一般是页面中颗粒度中最小也是最常用的组件，例如<code>input</code>，<code>button</code>等；高阶组件通常是由基础组件进行一定的变形、组合或两者兼有而形成的；而高阶组件+基础组件最终组成了完整的页面。 为了满足2B场景下的整体风格替换，所有组件在开发的时候要将用到的颜色、字体等&quot;原子&quot;用变量的方式引入。</p><p>在目前前端开发中，样式的变量创建方式主要有两种：一是基于css原生支持的自定义变量，二是基于<code>less</code>、<code>scss</code>等css预编译器。考虑到自定义变量可能存在的浏览器兼容性问题，组件库可以采用了less作为样式开发的语言。less 是一门 CSS 预处理语言，除了之前提到的变量功能，还有嵌套、混合（mixin）、函数等方便的功能。</p><h2 id="前端组件设计原则" tabindex="-1">前端组件设计原则 <a class="header-anchor" href="#前端组件设计原则" aria-label="Permalink to &quot;前端组件设计原则&quot;">​</a></h2><ul><li>层次结构和 UML 类图</li><li>扁平化、面向数据的 state/props</li><li>更加纯粹的 <code>State</code> 变化</li><li>高内聚，低耦合</li><li>辅助代码分离</li><li>提炼精华</li><li>及时模块化</li><li>集中/统一的状态管理</li></ul><h2 id="原子化设计" tabindex="-1">原子化设计 <a class="header-anchor" href="#原子化设计" aria-label="Permalink to &quot;原子化设计&quot;">​</a></h2><p>原子设计是一种方法论，由原子、分子、组织、模板和页面共同协作以创造出更有效的用户界面系统的一种设计方法。</p><p>原子设计的五个阶段分别是：</p><ol><li>Atoms原子。 为网页构成的基本元素。例如标签、输入，或是一个按钮，也可以为抽象的概念，例如字体、色调等。</li><li>Molecules分子。 由原子构成的简单UI组件。例如，一个表单标签，搜索框和按钮共同打造了一个搜索表单分子。</li><li>Organisms组织。 由原子及分子组成的相对复杂的UI构成物</li><li>Templates模版。 将以上元素进行排版，显示设计的底层内容结构。</li><li>Pages页面。 将实际内容（图片、文章等）套件在特定模板，页面是模板的具体实例</li></ol><h2 id="how-to-build-a-component-library" tabindex="-1">How to build a component library <a class="header-anchor" href="#how-to-build-a-component-library" aria-label="Permalink to &quot;How to build a component library&quot;">​</a></h2><h3 id="modern-library-feature" tabindex="-1">Modern Library Feature <a class="header-anchor" href="#modern-library-feature" aria-label="Permalink to &quot;Modern Library Feature&quot;">​</a></h3><ol><li>Output to <code>esm</code>, <code>cjs</code>, and <code>umd</code> formats</li><li>Support tree-shaking, output <code>esm</code> can cover it(if <code>css-in-js</code>)</li><li>Output to multiple files(folder to folder, file to file)</li><li>Better tree-shaking by maintaining the file structure</li><li>This makes it easier to mark specific files as having side effects, which helps the developer&#39;s bundler with tree-shaking</li><li>Support TypeScript types</li></ol><h3 id="build-output" tabindex="-1">build output <a class="header-anchor" href="#build-output" aria-label="Permalink to &quot;build output&quot;">​</a></h3><p>key feature:</p><ul><li>Dead code elimination, or Tree shaking, as it’s often called, is very important to achieve the optimum bundle size and hence app performance.</li></ul><h3 id="webpack-vs-rollup" tabindex="-1">webpack vs rollup <a class="header-anchor" href="#webpack-vs-rollup" aria-label="Permalink to &quot;webpack vs rollup&quot;">​</a></h3><blockquote><p>Use webpack for apps, and Rollup for libraries</p></blockquote><ul><li>output to <code>ESM</code> formats still is an experimental feature in webpack latest version(5.74.0), <a href="https://webpack.js.org/configuration/output/#type-module" target="_blank" rel="noreferrer">output.library.type</a></li></ul><h3 id="scope" tabindex="-1">scope <a class="header-anchor" href="#scope" aria-label="Permalink to &quot;scope&quot;">​</a></h3><p>how to build a React component library</p><h3 id="ways" tabindex="-1">ways <a class="header-anchor" href="#ways" aria-label="Permalink to &quot;ways&quot;">​</a></h3><h4 id="rollup" tabindex="-1">rollup <a class="header-anchor" href="#rollup" aria-label="Permalink to &quot;rollup&quot;">​</a></h4><h4 id="tsc" tabindex="-1">tsc <a class="header-anchor" href="#tsc" aria-label="Permalink to &quot;tsc&quot;">​</a></h4><h4 id="glup-babel" tabindex="-1">glup + babel <a class="header-anchor" href="#glup-babel" aria-label="Permalink to &quot;glup + babel&quot;">​</a></h4><h4 id="third-package" tabindex="-1">third package <a class="header-anchor" href="#third-package" aria-label="Permalink to &quot;third package&quot;">​</a></h4><ul><li><a href="https://github.com/unjs/unbuild" target="_blank" rel="noreferrer">unbuild</a></li><li><a href="https://github.com/egoist/tsup" target="_blank" rel="noreferrer">tsup</a></li></ul><h4 id="babel" tabindex="-1">babel <a class="header-anchor" href="#babel" aria-label="Permalink to &quot;babel&quot;">​</a></h4><h3 id="example" tabindex="-1">example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;example&quot;">​</a></h3><h4 id="mui" tabindex="-1">Mui <a class="header-anchor" href="#mui" aria-label="Permalink to &quot;Mui&quot;">​</a></h4><p>@emotion, css in js, <code> &quot;sideEffects&quot;: false,</code></p><ul><li>use rollup to bundle umd format output</li><li>use tsc to build type</li><li>use babel to build esm/cjs, folder structure</li></ul><h4 id="chakra-ui" tabindex="-1"><a href="https://github.com/chakra-ui/chakra-ui" target="_blank" rel="noreferrer">chakra-ui</a> <a class="header-anchor" href="#chakra-ui" aria-label="Permalink to &quot;[chakra-ui](https://github.com/chakra-ui/chakra-ui)&quot;">​</a></h4><p>turborepo + pnpm workspace, each component is a package. gather in <code>@chakra-ui/react</code> as dependencies and use <code>tsup</code> to bundle component</p><p>@emotion, css in js, <code> &quot;sideEffects&quot;: false,</code></p><p>folder structure</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── package</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ ├── components</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ ├── button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── src</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**tests**</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**stories**</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── index.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── package.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── tsconfig.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── tsup.config.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ ├── react</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── src</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**tests**</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── index.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── package.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── tsconfig.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│ │ │ ├── tsup.config.ts</span></span></code></pre></div><p><code>tsup.config.ts</code> each component is same</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { defineConfig } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;tsup&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { findUpSync } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;find-up&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  clean: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  format: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;cjs&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;esm&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  outExtension</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ctx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { js: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`.\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ctx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">format</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}.js\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  inject: process.env.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">JSX</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">findUpSync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;react-shim.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> undefined</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><h4 id="naive-ui" tabindex="-1"><a href="https://github.com/tusen-ai/naive-ui" target="_blank" rel="noreferrer">naive-ui</a> <a class="header-anchor" href="#naive-ui" aria-label="Permalink to &quot;[naive-ui](https://github.com/tusen-ai/naive-ui)&quot;">​</a></h4><ul><li>use rollup to bundle umd format output</li><li>use tsc to build esm and cjs folder structure, tsc can do this</li></ul><p><code>tsconfig.esm.json</code></p><div class="language-json5 vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json5</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  extends</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./tsconfig.json&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  exclude</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;**/*.spec.ts&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  include</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;src/components&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  compilerOptions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    declaration</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    noEmit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    rootDir</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./src/components&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    outDir</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./es&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // cjs CommonJs</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ES6&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    target</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ES6&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="ant-design" tabindex="-1">ant-design <a class="header-anchor" href="#ant-design" aria-label="Permalink to &quot;ant-design&quot;">​</a></h3><p><a href="https://github.com/ant-design/antd-tools" target="_blank" rel="noreferrer"><code>antd-tools</code></a>: <code>glup + babel</code></p><p>less config</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;sideEffects&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;dist/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;es/**/style/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;lib/**/style/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;.less&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="headless-components-ui" tabindex="-1">Headless components/UI <a class="header-anchor" href="#headless-components-ui" aria-label="Permalink to &quot;Headless components/UI&quot;">​</a></h2><ul><li>Good example: <a href="https://tanstack.com/table/v8/docs/guide/introduction" target="_blank" rel="noreferrer">TanStack Table</a> Can know more.</li><li><a href="https://juejin.cn/post/7160223720236122125" target="_blank" rel="noreferrer">全新的 React 组件设计理念 Headless UI</a></li><li><a href="https://martinfowler.com/articles/headless-component.html" target="_blank" rel="noreferrer">Headless Component: a pattern for composing React UIs</a></li><li><a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">shadcn/ui</a> Re-usable components built using Radix UI and Tailwind CSS. 不是通过npm安装而是直接Pick the components you need. Copy and paste the code into your project and customize to your needs.</li></ul><p>The libraries will give you well tested and accessible components or hooks without any default styling, so you can style and render them however you’d like, and if the authors were kind enough — you’ll also be able to control their functionality and behavior.</p><p>When building design system, these requirements need answer:</p><ul><li>Accessibility: the components must be accessible.</li><li>Theming: each component should support multiple themes (light mode\\dark mode for example).</li><li>Uniqueness: The look of our product should be unique. We don’t want our product to have that Material (or Bootstrap) generic look and feel. We have a design team, and they determine how our product should look like.</li><li>Browser support: it should support all major browsers.</li><li>Functionality: We need complete control on how our components behave.</li><li>Responsiveness — it should support all screen sizes and devices.</li><li>Maintainability: it should be easy and seamless to modify and maintain.</li></ul><h3 id="shadcn-ui" tabindex="-1">shadcn/ui <a class="header-anchor" href="#shadcn-ui" aria-label="Permalink to &quot;shadcn/ui&quot;">​</a></h3><ul><li><a href="https://mp.weixin.qq.com/s/Vo6gz7YiyPmHSyVssyJJ9A" target="_blank" rel="noreferrer">shadcn/ui 是什么、使用方式、实现原理</a></li></ul><p>Shadcn UI 组件的通用架构如下：</p><p><img src="`+t+'" alt=""></p><p>shadcn/ui基于核心原则构建，即组件的设计应与其实现分开。因此，shadcn/ui中的每个组件都具有两层架构。即：</p><ul><li>结构和行为层</li><li>样式层</li></ul><h2 id="reference" tabindex="-1">reference <a class="header-anchor" href="#reference" aria-label="Permalink to &quot;reference&quot;">​</a></h2><ul><li><a href="https://github.com/frehner/modern-guide-to-packaging-js-library" target="_blank" rel="noreferrer">The Modern Guide to Packaging your JavaScript library</a></li><li><a href="https://medium.com/@nirbenyair/headless-components-in-react-and-why-i-stopped-using-ui-libraries-a8208197c268" target="_blank" rel="noreferrer">Headless components in React and why I stopped using a UI library for our design system</a></li></ul>',71)]))}const E=i(l,[["render",h]]);export{u as __pageData,E as default};