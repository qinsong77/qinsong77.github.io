import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { getToken } from '../common/auth'

// 进度条
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    // linkActiveClass: 'active',
    // base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
})

router.beforeEach((to, from, next) => {
    // NProgress.start()
    next()
})

router.afterEach((to) => {
    document.title = to.meta.title || 'Sysuke\'s Blog'
})
router.onError((err) => {
})
export default router
