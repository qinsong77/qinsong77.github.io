Promise.prototype.all = function (prs) {
	return new Promise((resolve, reject) => {
		if(Array.isArray(prs)) {
			reject(new TypeError('should be an array'))
		}
		let result = []
		let count = 0
		for(let i = 0; i < prs.length;i++) {
			Promise.resolve(prs[i])
				.then(res => {
					result[i] = res
					count++
					if(count === prs.length) resolve(result)
				})
				.catch(e => {
					reject(e)
				})
		}
	})
}

function debounce(fn, wait) {
	let timer = null
	return function (...args) {
		if(timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, wait)
	}
}

function throttle(fn, wait) {
	let timer = null
	let prev = 0
	return function (...args) {
		const now = + Date.now()
		if(timer) clearTimeout(timer)
		const remain = wait - (now - prev)
		if(remain <= 0) {
			fn.apply(this, args)
			prev = now
		} else {
			timer = setTimeout(() => {
				fn.apply(this, args)
				prev = now
				timer = null
			}, remain)
		}
	}
}
