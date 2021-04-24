new Promise((resolve) => {
	setTimeout(() => {
		resolve(1);
	}, 500);
})
	.then((res) => {
		console.log(res);
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(2);
			}, 500);
		});
	})
	.then(console.log);


function Promise(executor) {
	this.value = null
	this.state = 'pending'
	this.cb = []
	this.errorCb = []
	const resolve = (value) => {
		this.state = 'fuiled'
		this.value = value
		this.cb.forEach(fn => fn(value))
	}
	const reject = reason => {
		this.state = 'rejected'
		this.value = reason
		this.errorCb.forEach(fn => fn(reason))
	}
	try {
		executor(resolve, reject)
	} catch (e) {
		reject(e)
	}
}

Promise.prototype.then = function (onFuiled, onReject) {
	return new Promise((resolve, reject) => {
		this.cb.push()
	})
}
