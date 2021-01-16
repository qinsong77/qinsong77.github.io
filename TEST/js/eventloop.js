// new Promise((resolve, reject) => {
// 	reject(1)
// }).then(() => {
// 	console.log(112)
// }).catch()
// 	.catch()
// 	.catch().catch(e => {
// 		console.log(e) // 1
// })
setTimeout(() => {
	console.log('setTimeout 1')
})

new Promise((resolve, reject) => {
	console.log('promise 1')
	resolve(1)
}).then(res => {
	console.log('promise 1 resolved')
	setTimeout(() => {
		console.log('setTimeout 2')
	}, 0)
	setTimeout(() => {
		console.log('setTimeout 3')
	}, 0)
	new Promise((resolve, reject) => {
		resolve(1)
		console.log('Promise 2')
	}).then(() => {
		console.log('Promise 2 resolved')
		new Promise((resolve => {
			console.log('new Promise 3')
			resolve(121212)
		}))
			.then(res => {
				console.log('new Promise 3 resolve')
			})
	}).catch()
		.catch()
		.catch()
		.catch(e => {
			console.log(e)
		})
})
// promise 1
// promise 1 resolved
// Promise 2
// Promise 2 resolved
// new Promise 3
// new Promise 3 resolve
// setTimeout 1
// setTimeout 2
// setTimeout 3
