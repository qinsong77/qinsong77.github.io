module.exports = {
	plugins: ['@vuepress/back-to-top'],
	// theme: 'reco',
	title: 'Sysuke\' NoteBook',
	description: 'person NoteBook power by VuePress & GitHub Page',
	// 注入到当前页面的 HTML <head> 中的标签
	head: [
		['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
	],
	base: '/',
	// dest: '',
	markdown: {
		lineNumbers: true // 代码块显示行号
	},
	themeConfig: {
		sidebarDepth: 0, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
		lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
		displayAllHeaders: true, // 默认值：false
		activeHeaderLinks: false, // 默认值：true
		nav: [
			{
				text: 'home',
				link: '/'
			},
			{
				text: '前端',
				link: '/fe/'
			},
			{
				text: 'algorithm',
				link: '/algorithm/'
			},
			{
				text: '后端',
				link: '/backEnd/'
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
					title: 'JavaScript',   // 必要的
					// path: '/foo/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: true, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['', 'LearnAndNoteList'],
						'alwaysNote',
						'learn',
						'achieve',
						'prototype',
						'extend'
					]
				},
				{
					title: 'Vue',   // 必要的
					path: '/fe/vue/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: true, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['vue/', '实用技巧'],
						'vue/alwaysNote',
					]
				},
				{
					title: 'CSS',   // 必要的
					path: '/fe/css/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['css/', 'Summary'],
						'css/BFC',
					]
				},
				{
					title: 'Dom',   // 必要的
					path: '/fe/dom/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['dom/', 'Summary'],
						'dom/safety',
					]
				},
				{
					title: 'webpack',   // 必要的
					path: '/fe/webpack/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['webpack/', 'Summary']
					]
				},
				{
					title: 'frameWork',   // 必要的
					path: '/fe/frameWork/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['frameWork/', 'Summary'],
						'frameWork/microservices',
						'frameWork/network'
					]
				}
			],
			'/algorithm/': [
				'',
				'binaryTree',
				'sort',
				'leetCode',
				'dynamic',
			],
			'/backEnd/': [
				{
					title: 'node',   // 必要的
					// path: '/backEnd/node/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['', 'Summary'],
					]
				}
			],
			'/interview/': [
				{
					title: 'Summary',   // 必要的
					// path: '/backEnd/node/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
					collapsable: false, // 可选的, 默认值是 true,
					// sidebarDepth: 2,    // 可选的, 默认值是 1
					children: [
						['', 'Summary'],
					]
				}
			]
		}

	}
}
