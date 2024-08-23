import { defineConfig, type DefaultTheme } from 'vitepress'
// https://vite-pwa-org.netlify.app/guide/
// https://github.com/vitest-dev/vitest/blob/main/docs/.vitepress/scripts/pwa.ts
// import { VitePWA } from 'vite-plugin-pwa'

const nav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/' },
  {
    text: '前端',
    activeMatch: `^/fe/`,
    items: [
      {
        text: 'JavaScript',
        link: '/fe/js/',
        activeMatch: '^/fe/js'
      },
      {
        text: 'React',
        link: '/fe/react/',
        activeMatch: '^/fe/react'
      },
      {
        text: 'Typescript',
        link: '/fe/typescript/',
        activeMatch: '^/fe/typescript'
      },
      {
        text: 'Vue',
        link: '/fe/vue/',
        activeMatch: '^/fe/vue'
      },
      {
        text: 'CSS',
        link: '/fe/css/',
        activeMatch: '^/fe/css'
      },
      {
        text: 'Dom',
        link: '/fe/dom/',
        activeMatch: '^/fe/dom'
      },
      {
        text: 'webpack',
        link: '/fe/webpack/',
        activeMatch: '^/fe/webpack'
      },
      {
        text: '测试',
        link: '/fe/test/',
        activeMatch: '^/fe/test'
      },
      {
        text: 'frameWork',
        link: '/fe/frameWork/',
        activeMatch: '^/fe/frameWork'
      },
      {
        text: '微前端',
        link: '/fe/MicroFrontends/',
        activeMatch: '^/fe/MicroFrontends/'
      }
    ]
  },
  {
    text: '算法',
    activeMatch: `^/algorithm/`,
    items: [
      {
        text: '数据结构',
        link: '/algorithm/dataStructure'
      },
      {
        text: '二叉树',
        link: '/algorithm/binaryTree/'
      },
      {
        text: '排序算法',
        link: '/algorithm/sort'
      },
      {
        text: 'LeetCode',
        link: '/algorithm/leetCode'
      },
      {
        text: '动态规划',
        link: '/algorithm/dynamic'
      },
      {
        text: '回溯算法',
        link: '/algorithm/backTrack'
      },
      {
        text: '面试记录',
        link: '/algorithm/interview'
      }
    ]
  },
  {
    text: '后端',
    activeMatch: `^/backEnd/`,
    items: [
      {
        text: 'Basic',
        activeMatch: `^/backEnd/base/`,
        link: '/backEnd/base/'
      },
      {
        text: 'Node',
        activeMatch: `^/backEnd/node/`,
        link: '/backEnd/node/'
      },
      {
        text: 'Java',
        activeMatch: `^/backEnd/java/`,
        link: '/backEnd/java/'
      },
      {
        text: 'Kotlin',
        activeMatch: `^/backEnd/kotlin/`,
        link: '/backEnd/kotlin/'
      },
      {
        text: '微服务',
        activeMatch: `^/backEnd/microservices/`,
        link: '/backEnd/microservices/'
      },
      {
        text: 'database',
        activeMatch: `^/backEnd/database/`,
        link: '/backEnd/database/'
      },
      {
        text: 'python',
        activeMatch: `^/backEnd/python/`,
        link: '/backEnd/python/'
      },
      {
        text: 'ruby',
        activeMatch: `^/backEnd/ruby/`,
        link: '/backEnd/ruby/'
      }
    ]
  },
  {
    text: 'stuff',
    activeMatch: `^/interview/|^/demo/|^/english/`,
    items: [
      {
        text: 'English',
        // activeMatch: `^/english/`,
        items: [
          { text: 'summary', link: '/english/' },
          { text: 'phrase', link: '/english/phrase' },
          { text: 'words', link: '/english/words' }
        ]
      },
      {
        text: '面试',
        // activeMatch: `^/interview/`,
        items: [
          { text: 'summary', link: '/interview/' },
          { text: 'blog', link: '/interview/blog' },
          { text: '框架面试题', link: '/interview/framework' }
        ]
      },
      {
        text: 'Demo',
        activeMatch: `^/demo/`,
        link: '/demo'
      }
    ]
  }
]

export const sidebar: DefaultTheme.Sidebar = {
  '/fe/': [
    {
      text: 'JavaScript',
      items: [
        // {
        //   text: 'Learn And Note List',
        //   link: '/fe/js/'
        // },
        {
          text: '学习笔记',
          link: '/fe/js/learn'
        },
        {
          text: '手写实现',
          link: '/fe/js/achieve'
        },
        {
          text: '原型、原型链、继承',
          link: '/fe/js/prototype'
        },
        {
          text: '继承',
          link: '/fe/js/extend'
        },
        {
          text: '变量和类型',
          link: '/fe/js/var_type'
        },
        {
          text: '类型转换',
          link: '/fe/js/type_conversion'
        },
        {
          text: '执行上下文、执行栈、this',
          link: '/fe/js/context_execution_stack_this'
        },
        {
          text: '事件循环',
          link: '/fe/js/event_loop'
        },
        {
          text: '常用笔记',
          link: '/fe/js/alwaysNote'
        },
        {
          text: '犯错记录',
          link: '/fe/js/error_logs'
        }
      ]
    },
    {
      text: 'React', // 必要的
      items: [
        {
          text: 'summary',
          link: '/fe/react/'
        },
        {
          text: 'React hooks',
          link: '/fe/react/react_hooks'
        },
        {
          text: 'React Around',
          link: '/fe/react/react_around'
        },
        {
          text: 'React Native',
          link: '/fe/react/react_native'
        },
        {
          text: 'Next.js',
          link: '/fe/react/next'
        },
        {
          text: 'React 18 & 19',
          link: '/fe/react/react_18_19'
        },
        {
          text: 'Next.js latest(14)',
          link: '/fe/react/next_latest'
        },
        {
          text: '构建你自己的 React 框架',
          link: '/fe/react/build_mini_react'
        },
        {
          text: 'Collection',
          link: '/fe/react/collection'
        }
      ]
    },
    {
      text: 'Typescript',
      items: [
        {
          text: 'summary',
          link: '/fe/typescript/'
        },
        {
          text: 'Typescript with React',
          link: '/fe/typescript/typescript_with_react'
        }
      ]
    },
    {
      text: 'Vue', // 必要的
      items: [
        {
          text: '原理',
          link: '/fe/vue/'
        },
        {
          text: 'Vuex',
          link: '/fe/vue/vuex'
        },
        {
          text: '常用笔记',
          link: '/fe/vue/alwaysNote'
        },
        {
          text: 'Vue3.0',
          link: '/fe/vue/vue3'
        }
      ]
    },
    {
      text: 'CSS',
      items: [
        {
          text: 'Summary',
          link: '/fe/css/'
        },
        {
          text: 'BFC和清除浮动',
          link: '/fe/css/BFC'
        },
        {
          text: 'flex和grid',
          link: '/fe/css/flex_grid'
        },
        {
          text: '1px和相关概念',
          link: '/fe/css/onepx'
        },
        {
          text: 'demo',
          link: '/fe/css/demo'
        },
        {
          text: 'css方案',
          link: '/fe/css/framework'
        }
      ]
    },
    {
      text: 'Dom',
      items: [
        {
          text: 'Summary',
          link: '/fe/dom/'
        },
        {
          text: '安全',
          link: '/fe/dom/safety'
        },
        {
          text: 'canvas',
          link: '/fe/dom/canvas'
        }
      ]
    },
    {
      text: 'webpack',
      items: [
        {
          text: 'Summary',
          link: '/fe/webpack/'
        },
        {
          text: 'Webpack5',
          link: '/fe/webpack/webpack5'
        },
        {
          text: '打包原理&Module Federation',
          link: '/fe/webpack/buildAndModuleFederation'
        },
        {
          text: 'Babel',
          link: '/fe/webpack/babel'
        },
        {
          text: 'Vite',
          link: '/fe/webpack/vite'
        }
      ]
    },
    {
      text: '测试',
      items: [
        {
          text: 'Summary',
          link: '/fe/test/'
        },
        {
          text: '前端测试简介&Vite配置Jest',
          link: '/fe/test/guideAndConfigSetting'
        },
        {
          text: 'Jest',
          link: '/fe/test/jest'
        },
        {
          text: 'React Testing Library',
          link: '/fe/test/rtl'
        },
        {
          text: '实战篇',
          link: '/fe/test/Combat'
        }
      ]
    },
    {
      text: 'FrameWork',
      items: [
        {
          text: '框架汇总',
          link: '/fe/frameWork/'
        },
        {
          text: '架构',
          link: '/fe/frameWork/architecture/'
        },
        {
          text: '敏捷汇总',
          link: '/fe/frameWork/agile-collections'
        },
        {
          text: '微前端',
          link: '/fe/frameWork/microservices'
        },
        {
          text: '移动端',
          link: '/fe/frameWork/mobile'
        },
        {
          text: '小程序',
          link: '/fe/frameWork/miniprogram'
        },
        {
          text: '服务端渲染',
          link: '/fe/frameWork/ssr'
        },
        {
          text: '网络相关',
          link: '/fe/frameWork/network'
        },
        {
          text: 'HTTP协议总结',
          link: '/fe/frameWork/http'
        },
        {
          text: 'HTTPS协议总结',
          link: '/fe/frameWork/https'
        },
        {
          text: 'websocket',
          link: '/fe/frameWork/websocket'
        },
        {
          text: '前端性能优化',
          link: '/fe/frameWork/performance'
        },
        {
          text: '组件库设计',
          link: '/fe/frameWork/component_library_design'
        },
        {
          text: '想法和总结',
          link: '/fe/frameWork/thought'
        }
      ]
    },
    {
      text: '微前端',
      items: [
        {
          text: 'Summary',
          link: '/fe/MicroFrontends/'
        },
        {
          text: '乾坤',
          link: '/fe/MicroFrontends/qiankun'
        },
        {
          text: 'Module Federation',
          link: '/fe/MicroFrontends/moduleFederation'
        },
        {
          text: 'MicroApp',
          link: '/fe/MicroFrontends/microapp'
        }
      ]
    }
  ],
  '/algorithm/': [
    {
      text: 'Basic',
      items: [
        {
          text: 'Collections',
          link: '/algorithm/'
        },
        {
          text: '数据结构',
          link: '/algorithm/dataStructure'
        }
      ]
    },
    {
      text: '二叉树',
      items: [
        {
          text: 'Basic',
          link: '/algorithm/binaryTree/'
        },
        {
          text: 'LeetCode',
          link: '/algorithm/binaryTree/leetcode'
        }
      ]
    },
    {
      text: 'Categorizes',
      items: [
        {
          text: '排序',
          link: '/algorithm/sort'
        },
        {
          text: 'LeetCode',
          link: '/algorithm/leetCode'
        },
        {
          text: '动态规划',
          link: '/algorithm/dynamic'
        },
        {
          text: '回溯',
          link: '/algorithm/backTrack'
        },
        {
          text: 'Interview',
          link: '/algorithm/interview'
        }
      ]
    }
  ],
  '/backEnd/': [
    {
      text: 'Basic',
      items: [
        {
          text: 'Concept',
          link: '/backEnd/base/'
        },
        {
          text: 'Docker',
          link: '/backEnd/base/docker'
        },
        {
          text: 'Auth',
          link: '/backEnd/base/auth'
        }
      ]
    },
    {
      text: 'Node',
      items: [
        {
          text: 'Summary',
          link: '/backEnd/node/'
        },
        {
          text: '四十行代码实现一个koa',
          link: '/backEnd/node/koa'
        },
        {
          text: '文件合并',
          link: '/backEnd/node/fileMerge'
        },
        {
          text: 'v8',
          link: '/backEnd/node/v8'
        }
      ]
    },
    {
      text: 'Java',
      items: [
        {
          text: 'Summary',
          link: '/backEnd/java/'
        }
      ]
    },
    {
      text: 'Kotlin',
      items: [
        {
          text: 'Summary',
          link: '/backEnd/kotlin/'
        }
      ]
    },
    {
      text: '微服务',
      items: [
        {
          text: 'Summary',
          link: '/backEnd/microservices/'
        }
      ]
    },
    {
      text: 'Database',
      items: [
        {
          text: 'Summary',
          link: '/backEnd/database/'
        },
        {
          text: 'My sql',
          link: '/backEnd/database/mysql'
        }
      ]
    },
    {
      text: 'python',
      link: '/backEnd/python'
    },
    {
      text: 'ruby',
      link: '/backEnd/ruby'
    }
  ],
  '/english/': [
    {
      text: 'English',
      items: [
        {
          text: 'summary',
          link: '/english/'
        },
        {
          text: 'phrase',
          link: '/english/phrase'
        },
        {
          text: 'words',
          link: '/english/words'
        }
      ]
    }
  ],
  '/interview/': [
    {
      text: 'interview',
      items: [
        {
          text: 'summary',
          link: '/interview/'
        },
        {
          text: 'blog',
          link: '/interview/blog'
        },
        {
          text: 'framework',
          link: '/interview/framework'
        }
      ]
    }
  ]
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sysuke's World",
  description: 'A FE Blog Site',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],
  // scrollOffset: 'header',

  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: 'favicon.ico',
    logo: '/icons/128.ico',
    search: {
      provider: 'local'
    },
    nav: nav,

    sidebar: sidebar,
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/qinsong77' }],
    footer: {
      message: 'In case I don\'t see you. Good afternoon, good evening, and good night.',
      copyright: 'Copyright © 2019-present Notend'
    },

  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // todo pwa
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#333' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/128.ico' }]
    // 百度统计
    // [
    //   'script',
    //   {},
    //   `
    // 	var _hmt = _hmt || [];
    // 	(function() {
    // 		var hm = document.createElement("script");
    // 		hm.src = "https://hm.baidu.com/hm.js?b180689c6fba69ad8ef56c3e0034ce9f";
    // 		var s = document.getElementsByTagName("script")[0];
    // 		s.parentNode.insertBefore(hm, s);
    // 	})();
    // 	`
    // ]
  ]
  // https://github.com/vite-pwa/vitepress/blob/main/examples/pwa-prompt/.vitepress/config.ts
  // pwa: {
  //   mode: 'development',
  //   base: '/',
  //   scope: '/',
  //   includeAssets: ['favicon.svg'],
  //   manifest: {
  //     "name": "Sysuke' World",
  //     "short_name": "Sysuke",
  //     theme_color: '#2979ff',
  //     "icons": [
  //       {
  //         "src": "/icons/64",
  //         "sizes": "64x64",
  //         "type": "image/x-icon"
  //       },
  //       {
  //         "src": "/icons/128.ico",
  //         "sizes": "128x128",
  //         "type": "image/x-icon"
  //       },
  //       {
  //         "src": "/icons/256.ico",
  //         "sizes": "256x256",
  //         "type": "image/x-icon"
  //       },
  //       {
  //         "src": "/icons/512.ico",
  //         "sizes": "512x512",
  //         "type": "image/x-icon"
  //       }
  //     ],
  //   },
  //   workbox: {
  //     globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
  //   },
  //   devOptions: {
  //     enabled: true,
  //     suppressWarnings: true,
  //     navigateFallback: '/',
  //   },
  // }
})
