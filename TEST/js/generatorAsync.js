function getJSON(data) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(data)
		}, 3000)
	})
}

asyncRT(function* () {
	try {
		console.log('start')
		console.time()
		const result1 = yield getJSON('data/first.json')
		const result2 = yield getJSON(result1)
		const result3 = yield getJSON(result2)
		console.log(result3)
		console.timeEnd()
	} catch (e) {
		console.log(e)
	}
})

function asyncRT(generator) {
	// 创建一个迭代器
	const gen = generator()
	
	// generator执行顺序控制器
	function next(arg) {
		const result = gen.next(arg)
		// 如果已经结束，则直接return
		if (result.done) return
		const value = result.value
		// 如果是Promise则在then里执行next
		if (value instanceof Promise) {
			value.then(res => next(res))
				.catch(err => gen.throw(err))
		}
	}
	
	try {
		next()
	} catch (e) {
		gen.throw(e)
	}
}
