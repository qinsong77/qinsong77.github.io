function myCo(gen) {
	return new Promise(((resolve, reject) => {
		function next(data) {
			try {
				var { value, done } = gen.next(data)
			} catch (e) {
				return reject(e)
			}
			if (!done) {
				//done为true,表示迭代完成
				//value 不一定是 Promise，可能是一个普通值。使用 Promise.resolve 进行包装。
				Promise.resolve(value).then(val => {
					next(val)
				}, reject)
			} else {
				resolve(value)
			}
		}
		
		next() //第一次调用next函数时，传递的参数无效
	}))
}

function* test() {
	yield new Promise((resolve, reject) => {
		setTimeout(resolve, 100)
	})
	yield new Promise((resolve, reject) => {
		// throw Error(1);
		resolve(10)
	})
	yield 10
	return 1000
}

myCo(test()).then(data => {
	console.log(data) //输出1000
}).catch((err) => {
	console.log('err: ', err)
})
