import{_ as a,o as i,c as n,ag as l}from"./chunks/framework.CAXxHpAX.js";const p="/assets/fe-process-copy.BD9XquFd.webp",d=JSON.parse('{"title":"想法和总结","description":"","frontmatter":{"title":"想法和总结"},"headers":[],"relativePath":"fe/frameWork/thought.md","filePath":"fe/frameWork/thought.md","lastUpdated":1776849342000}'),e={name:"fe/frameWork/thought.md"};function t(E,s,h,k,r,o){return i(),n("div",null,[...s[0]||(s[0]=[l(`<h3 id="中后台系统" tabindex="-1">中后台系统 <a class="header-anchor" href="#中后台系统" aria-label="Permalink to &quot;中后台系统&quot;">​</a></h3><h4 id="中台" tabindex="-1">中台 <a class="header-anchor" href="#中台" aria-label="Permalink to &quot;中台&quot;">​</a></h4><ul><li><a href="https://zhuanlan.zhihu.com/p/75223466" target="_blank" rel="noreferrer">中台”到底是什么？</a></li></ul><p>目的：便于高速发展的复杂应用的敏捷开发</p><p>手段：解耦，提高复用</p><p>在一般的中后台系统中，我们可以把前端的架构划分为三大部分：这分别是<strong>核心框架库</strong>，<strong>插件</strong>，<strong>公共机制</strong>。</p><ul><li>核心框架库： 系统的基础框架技术选型，比如像Vue,Vuex,Vue Router，或者说React,Redux,Router这样的，就属于核心框架库，这一部分选型是在前期完成的，需要慎重，因为它决定了整个系统以后的开发走向；</li><li>插件： 可以理解为工具库，比如UI框架库antd、element，图表工具库eCharts，3d库three.js等等</li><li>公共机制： 把一些公共的功能模块封装起来，以供其他开发人员使用，极大提升开发效率。核心在于封装。</li></ul><p>在中后台系统中，这一般包括以下五个小部分：</p><ol><li><p>UI组件库的二次封装。这针对一些极其常用的UI组件，主要是为了统一风格，以使用频率最高的table和form为代表；</p></li><li><p>请求插件的封装。以axios为例，主要是做后台请求发生错误的统一拦截显示；</p></li><li><p>后台API请求的URL地址文件封装。这主要是为了统一管理，使得URL不会零散地分布在各个业务组件中，统一修改，统一替换公共域名等；</p></li><li><p>权限和菜单的封装。一般中后台系统是分人员角色的，那么不同的角色就对应不同的权限，拿到的菜单也不一样；</p></li><li><p>格式化的封装。像中后台系统里面的很多格式是比较常见的，如身份证、电话号码、日期、金额、车牌号等，这些可用于一些前端校验和前端展示的场景，且在很多地方都会用到，所以非常有必要把一些常用的格式化操作放到全局。</p></li></ol><ul><li><a href="https://blog.csdn.net/qq_29438877/article/details/108675426" target="_blank" rel="noreferrer">前端架构探索与实践</a></li></ul><h2 id="项目目录结构" tabindex="-1">项目目录结构 <a class="header-anchor" href="#项目目录结构" aria-label="Permalink to &quot;项目目录结构&quot;">​</a></h2><ul><li><a href="https://mp.weixin.qq.com/s/INNwbrax3NHiC5fganeFlQ" target="_blank" rel="noreferrer">React 项目文件分层原则</a></li></ul><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">project-root/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .github/                     # GitHub 相关</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── workflows/               # CI/CD 配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│       └── deploy.yml</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .husky/                      # Git Hooks</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── pre-commit               # 提交前检查</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── commit-msg               # commit 信息检查</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .vscode/                     # VS Code 配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── settings.json            # 编辑器设置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── extensions.json          # 推荐插件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── launch.json              # 调试配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── public/                      # 静态资源</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── favicon.ico</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── robots.txt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── manifest.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── scripts/                     # 自定义脚本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── build.js                 # 构建脚本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── deploy.js                # 部署脚本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── generate-component.js    # 组件生成脚本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── src/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── assets/                  # 资源文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   │   ├── images/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   │   ├── fonts/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   │   └── icons/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── components/              # 通用组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── features/                # 业务功能</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── pages/                   # 页面组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── layouts/                 # 布局组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── hooks/                   # 自定义 Hooks</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── services/                # API 服务</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── store/                   # 状态管理</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── utils/                   # 工具函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── types/                   # TS 类型定义</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── constants/               # 常量</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── config/                  # 配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── styles/                  # 全局样式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── App.tsx                  # 根组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── main.tsx                 # 入口文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── vite-env.d.ts            # Vite 类型声明</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── tests/                       # 测试文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── unit/                    # 单元测试</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   ├── integration/             # 集成测试</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">│   └── e2e/                     # 端到端测试</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .env.example                 # 环境变量示例</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .eslintrc.js</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .prettierrc</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── .gitignore</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── tsconfig.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── vite.config.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">├── package.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">└── README.md</span></span></code></pre></div><h2 id="前端工作流" tabindex="-1">前端工作流 <a class="header-anchor" href="#前端工作流" aria-label="Permalink to &quot;前端工作流&quot;">​</a></h2><p>忘记哪里copy的了</p><p><img src="`+p+'" alt=""></p>',16)])])}const g=a(e,[["render",t]]);export{d as __pageData,g as default};
