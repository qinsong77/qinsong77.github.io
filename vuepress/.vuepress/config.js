module.exports = {
	title: 'Sysuke\' Blog',
	description: 'person blog power by VuePress & GitHub Page',
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
		sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
		lastUpdated: 'Last Updated' // 文档更新时间：每个文件git最后提交的时间
	}
}
