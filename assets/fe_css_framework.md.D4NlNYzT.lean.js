import{_ as s,c as t,a2 as e,o as l}from"./chunks/framework.BQmytedh.js";const f=JSON.parse('{"title":"css方案","description":"","frontmatter":{},"headers":[],"relativePath":"fe/css/framework.md","filePath":"fe/css/framework.md","lastUpdated":1696600456000}'),i={name:"fe/css/framework.md"};function r(n,a,o,c,p,d){return l(),t("div",null,a[0]||(a[0]=[e('<h1 id="css方案" tabindex="-1">css方案 <a class="header-anchor" href="#css方案" aria-label="Permalink to &quot;css方案&quot;">​</a></h1><ul><li><a href="https://github.com/unocss/unocss" target="_blank" rel="noreferrer">unocss</a> 原子化CSS模式实现的一种, No parsing, no AST, no scanning, it&#39;s INSTANT.</li></ul><h2 id="tailwindcss" tabindex="-1"><a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">tailwindcss</a> <a class="header-anchor" href="#tailwindcss" aria-label="Permalink to &quot;[tailwindcss](https://tailwindcss.com/)&quot;">​</a></h2><p>原子化CSS模式实现</p><p>不是原子化的弊端，其他原子化方案的优劣需要另外分析。</p><p>不适用于复杂跨团队的项目，特别是设计团队有自己的视觉规范的项目。</p><p>tw有这几个特点：非常强的自定义能力、依赖编译、类名全局可见。而最大的问题就在后者，导致没有很好的样式隔离方案，只能通过加前缀。</p><ul><li>适合的场景：规模较小、很少迭代的一次性页面。例如运行活动和小的后台系统。</li><li>不适合的场景：</li></ul><ol><li>规模较大，涉及多开发团队合作的大型页面，。例如几百个页面的后台系统</li><li>UI频繁变更且前端逻辑复杂的页面，例如飞书文档这种</li><li>可复用的模块，例如文档编辑器组件或者需要用微前端方式嵌入到其他系统的页面</li></ol><p>为啥这几种场景不适合呢？这都是因为没法样式隔离，并且还上依赖构建导致的。 如果两套不一样的ui规范，或者两个不同的开发团队，他们用的tw类名可能是不同的，例如p-small可能是2px也可能是4px。这在不同的系统上运作良好，但如果把他们放到一个页面上呢？例如通过npm包或者模块联邦来整合。这种情况下有人觉得不是可以加前缀嘛？首先，添加前缀是要重构html的，原来的class=p-small要改写成class=a-p-small，除非项目启动就规定好，不然重构成本很大；其次，带有前缀类名对应的样式怎么编译？自定义类名需要使用tailwind.config.js，如果项目用的前缀是a，某个npm包要求用b，如何配置？这种情况下就只能npm包要提前打包好样式文件而不依赖主工程去编译了。不过如果要用前缀的话，还有人愿意用tailwind吗？</p>',10)]))}const h=s(i,[["render",r]]);export{f as __pageData,h as default};