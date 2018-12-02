import layout from '_c/layout'

const routes = [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'main',
        component: layout,
        redirect: '/blog',
        children: [
            {
                path: '/blog',
                name: 'blog',
                component: () => import('_v/blog'),
                redirect: '/blog/recent',
                children: [
                    {
                        path: 'recent',
                        name: 'recent',
                        // alias: '/blog',
                        component: () => import('_v/blog/recent')
                    },
                    {
                        path: 'frontend',
                        name: 'frontend',
                        component: () => import('_v/blog/articles')
                    },
                    {
                        path: 'mobile',
                        name: 'mobile',
                        component: () => import('_v/blog/mobile')
                    },
                    {
                        path: 'background',
                        name: 'background',
                        component: () => import('_v/blog/background')
                    },
                    {
                        path: 'notebook',
                        name: 'notebook',
                        component: () => import('_v/blog/notebook')
                    },
                    {
                        path: 'article/:id',
                        name: 'article',
                        component: () => import('_v/blog/articles/detail')
                    },
                    {
                        path: 'article/tag/:id',
                        name: 'tag',
                        component: () => import('_v/blog/tag')
                    }
                ]
            },
            {
                path: '/demos',
                name: 'demos',
                component: () => import('_v/demos')
            },
            {
                path: '/archive',
                name: 'archive',
                component: () => import('_v/archive')
            },
            {
                path: '/me',
                name: 'me',
                component: () => import('_v/me')
            },
            {
                path: '/setting',
                name: 'setting',
                component: () => import('_v/setting')
            }
        ]
    }
]
export default routes
