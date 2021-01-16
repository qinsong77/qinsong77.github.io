const getJson = function (url) {
	return new Promise((resolve, reject) => {
		const handler = function () {
			if (this.readyState !== 4) {
				return
			}
			if (this.status === 200) {
				resolve(this.response)
			} else reject(new Error(this.statusText))
		}
		const xhr = new XMLHttpRequest()
		xhr.open('GET', url)
		xhr.onreadystatechange = handler
		xhr.responseType = 'json'
		xhr.setRequestHeader('Accept', 'application/json')
		xhr.send()
	})
}
console.time()
const p1 = new Promise(function (resolve, reject) {
	setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
	setTimeout(() => resolve(p1), 1000)
})

p2
	.then(result => console.log(result))
	.catch(error => console.timeEnd())
