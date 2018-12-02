import Axios from 'axios'

let baseURL = '/blog/api'
if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://sysuke.leanapp.cn/blog/api'
}
const timeOut = 10000

const fetch = (url, params, method = 'post') => {
    return new Promise((resolve, reject) => {
        let config = {
            baseURL: baseURL,
            url: url,
            method: method,
            timeout: timeOut,
            // headers: {
            //     'x-csrf-token': getToken()
            // }
        }
        if (method.match(/get|delete|head/)) {
            config.params = params
        } else {
            config.data = params
        }
        Axios(config).then(res => resolve(res.data), err => {
            if (err.response) {
                resolve(err.response.data)
            } else {
                resolve({ errors: [{ message: '断网啦!!!!!!!!!' }] })
            }
        })
    })
}

const $Axios = ((array) => {
    return array.reduce((a, b) => {
        a[b] = (url, params) => fetch(url, params, b)
        return a
    }, {})
})(['get', 'post', 'delete', 'patch', 'put'])
export default {
    install: (Vue, options) => {
        Vue.prototype.$Axios = $Axios
    }
}
