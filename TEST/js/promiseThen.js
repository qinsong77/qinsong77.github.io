new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(123)
	}, 2000)
})
	.then()
	.then()
	.then()
	.then(res => {
		console.log(res)
	})
