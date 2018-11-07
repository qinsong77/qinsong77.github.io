import layout from '_c/layout'

const routes = [
    // {
    //     path: '*',
    //     redirect: '/'
    // },
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
                        component: () => import('_v/blog/Articles')
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
