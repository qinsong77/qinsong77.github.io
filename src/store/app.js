const app = {
    state: {
        Loading: false,
        showNav: false,
        theme: localStorage.getItem('theme') ? localStorage.getItem('theme') : 'theme-default'
    },
    getters: {
        checkTheme: state => {
            return state.theme === 'theme-default'
        }
    },
    mutations: {
        hideLoading (state) {
            state.Loading = false
        },
        showLoading (state) {
            state.Loading = true
        },
        setShowNav (state) {
            state.showNav = !state.showNav
        },
        closeNav (state) {
            state.showNav = false
        },
        showNav (state) {
            state.showNav = true
        },
        setTheme (state, value) {
            localStorage.setItem('theme', value)
            state.theme = value
        }
    }
}
export default app
