Promise.all = function (values) {
	if (!Array.isArray(values)) {
		const type = typeof values
		return new TypeError(`TypeError: ${type} ${values} is not iterable`)
	}
	return new Promise((resolve, reject) => {
		let resultArr = []
		let orderIndex = 0
		const processResultByKey = (value, index) => {
			resultArr[index] = value
			if (++orderIndex === values.length) {
				resolve(resultArr)
			}
		}
		for (let i = 0; i < values.length; i++) {
			let value = values[i]
			if (value && typeof value.then === 'function') {
				value.then((value) => {
					processResultByKey(value, i)
				}, reject)
			} else {
				processResultByKey(value, i)
			}
		}
	})
}
let p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('ok1')
	}, 1000)
})

let p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('ok2')
	}, 1000)
})

Promise.all([1, 2, 3, p1, p2]).then(data => {
	console.log('resolve', data)
}, err => {
	console.log('reject', err)
})
