
new Promise(resolve => {
	resolve(1)
}).then(res => {
	console.log(res)
	return res
}).then(res => {
	console.log(res)
})
	.then(res => {
		console.log(res)
	})


console.time()
const p = new Promise((resolve, reject) => {
	setTimeout(()=> {
		console.log(123)
		// console.timeEnd()
		resolve(1)
	}, 5000)
})

p.then(res => {
	console.log(res)
	// console.time()
	return new Promise((resolve, reject) => {
		setTimeout(()=> {
			console.log(123)
			// console.timeEnd()
			resolve(1)
		}, 5000)
	})
}).then(res => {
	console.timeEnd()
	console.log(res)
})
