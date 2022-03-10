import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
export default defineUserConfig<DefaultThemeOptions>({
	port: 8091,
	title: 'Sysuke\' NoteBook',
	description: 'personal frontend noteBook power by VuePress & GitHub Page',
	// 注入到当前页面的 HTML <head> 中的标签
	head: [
		['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
		['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
		['meta', { name: 'theme-color', content: '#3eaf7c' }],
		['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
		['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
		['meta', { name: 'msapplication-TileColor', content: '#333' }],
		['link', { rel: 'apple-touch-icon', href: '/icons/128.ico' }],
	],
	base: '/',
	// dest: '',
	markdown: {
	},
	plugins: [
		['@vuepress/search', {
			searchMaxSuggestions: 10
		}],
		'@vuepress/back-to-top',
		[
			'@vuepress/pwa',
			{
				skipWaiting: true,
			}
		],
		[
			'@vuepress/plugin-pwa-popup',
			{
				locales: {
					'/': {
						message: "有更新哦！",
						buttonText: "refresh"
					},
					'/zh/': {
						message: "有更新哦！",
						buttonText: "refresh"
					},
				},
			},
		],
		[
			'@vuepress/medium-zoom'
		]
		// '@vuepress/pwa',
		// {
		// 	skipWaiting: true // 本选项开启了一个用于刷新内容的弹窗。这个弹窗将会在站点有内容更新时显示出来，并提供了一个 refresh 按钮，允许用户立即刷新内容。
		// }
	],
	themeConfig: {
		sidebarDepth: 0, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
		lastUpdated: true, // 文档更新时间：每个文件git最后提交的时间
		displayAllHeaders: true, // 默认值：false
		activeHeaderLinks: false, // 默认值：true
		logo: '/icons/128.ico',
		repo: 'https://github.com/qinsong77/qinsong77.github.io',
		navbar: [
			{
				text: '前端',
				link: '/fe/',
				children: [
					{
						text: 'JavaScript',
						link: '/fe/js',
						activeMatch: '^/fe/js',
					},
					{
						text: 'Vue',
						link: '/fe/vue',
						activeMatch: '^/fe/vue',
					},
					{
						text: 'React',
						link: '/fe/react',
						activeMatch: '^/fe/react',
					},
					{
						text: 'CSS',
						link: '/fe/css',
						activeMatch: '^/fe/css',
					},
					{
						text: 'Dom',
						link: '/fe/dom',
						activeMatch: '^/fe/dom',
					},
					{
						text: 'webpack',
						link: '/fe/webpack',
						activeMatch: '^/fe/webpack',
					},
					{
						text: 'frameWork',
						link: '/fe/frameWork',
						activeMatch: '^/fe/frameWork',
					},
				]
			},
			{
				text: '算法',
				link: '/algorithm/',
				children: [
					{
						text: '数据结构',
						link: '/algorithm/',
						activeMatch: '^/algorithm/',
					},
					{
						text: '二叉树',
						link: '/algorithm/binaryTree',
					},
					{
						text: '排序算法',
						link: '/algorithm/sort',
					},
					{
						text: 'LeetCode',
						link: '/algorithm/leetcode',
					},
					{
						text: '动态规划',
						link: '/algorithm/dynamic',
					},
					{
						text: '回溯算法',
						link: '/algorithm/backTrack',
					},
					{
						text: '面试记录',
						link: '/algorithm/interview',
					},
				]
			},
			{
				text: '后端',
				link: '/backEnd/node'
			},
			{
				text: '面试',
				link: '/interview/'
			},
			{
				text: 'Demo',
				link: '/demo'
			},
			{
				text: 'Resume',
				link: '/resume'
			},
			{
				text: 'GitHub',
				link: 'https://github.com/qinsong77',
				target: '_blank'
			}
		],
		sidebar: {
			'/fe/': [
				{
					text: 'JavaScript',
					// collapsible: true,
					children: [
						{
							text: 'LearnAndNoteList',
							link: '/fe/js/'
						},
						'/fe/js/learn',
						'/fe/js/achieve',
						'/fe/js/prototype',
						'/fe/js/extend',
						'/fe/js/var_type',
						'/fe/js/type_conversion',
						'/fe/js/context_execution_stack_this',
						'/fe/js/event_loop',
						'/fe/js/alwaysNote',
					]
				},
				{
					text: 'Vue',   // 必要的
					// collapsible: true,
					children: [
						{
							text: '原理',
							link: '/fe/vue/'
						},
						'/fe/vue/vuex',
						'/fe/vue/alwaysNote',
						'/fe/vue/vue3',
					]
				},
				{
					text: 'React',   // 必要的
					collapsible: true,
					children: [
						'/fe/react',
						'/fe/react/react_hooks',
						'/fe/react/react_around',
						'/fe/react/react_native',
						'/fe/react/typescript',
						'/fe/react/build_mini_react'
					]
				},
				{
					text: 'CSS',   // 必要的
					collapsible: true,
					children: [
						// ['css/', 'Summary'],
						// ['css/BFC', 'BFC和清除浮动'],
						'/fe/css',
						'/fe/css/BFC',
						'/fe/css/flex_grid',
						'/fe/css/onepx',
						'/fe/css/demo'
					]
				},
				{
					text: 'Dom',   // 必要的
					collapsible: true,
					children: [
						'/fe/dom',
						'/fe/dom/safety',
						'/fe/dom/canvas',
					]
				},
				{
					text: 'webpack',   // 必要的
					collapsible: true,
					children: [
						'/fe/webpack',
						'/fe/webpack/webpack5',
						'/fe/webpack/buildAndModuleFederation',
						'/fe/webpack/vite2',
					]
				},
				{
					text: 'frameWork',   // 必要的
					// collapsible: true,
					children: [
						'/fe/frameWork',
						'/fe/frameWork/microservices',
						'/fe/frameWork/mobile',
						'/fe/frameWork/miniprogram',
						'/fe/frameWork/ssr',
						'/fe/frameWork/network',
						'/fe/frameWork/http',
						'/fe/frameWork/https',
						'/fe/frameWork/websocket',
						'/fe/frameWork/performance',
						'/fe/frameWork/component_library_design',
						'/fe/frameWork/test',
						'/fe/frameWork/thought',
					]
				}
			],
			'/algorithm/': [
				'/algorithm/',
				'/algorithm/binaryTree',
				'/algorithm/sort',
				'/algorithm/leetCode',
				'/algorithm/dynamic',
				'/algorithm/backTrack',
				'/algorithm/interview'
			],
			'/backEnd/': [
				{
					text: 'Node',   // 必要的
					children: [
						'/backEnd/node',
						'/backEnd/node/koa',
						'/backEnd/node/fileMerge'
					]
				},
				{
					text: 'base',   // 必要的
					children: [
						'/backEnd/base',
						'/backEnd/base/docker'
					]
				},
				{
					text: 'v8',
					children: [
						'/backEnd/v8'
					]
				}
			],
			'/interview/': [
				{
					text: 'Summary',   // 必要的
					// path: '/backEnd/node/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					// collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						// ['', 'Summary'],
						'blog',
						'framework'
					]
				}
			]
		}

	}
})
