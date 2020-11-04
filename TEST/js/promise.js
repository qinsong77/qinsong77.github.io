class TrackAblePromise extends Promise {
	constructor(executor){
		const notifyHandlers = []
		super((resolve, reject) => {
			return executor(resolve, reject, (status) => {
				console.log(status)
				notifyHandlers.map((handler) => handler(status))
			})
		})
		this.notifyHandlers = notifyHandlers
	}

	notify (notifyHandler) {
		this.notifyHandlers.push(notifyHandler)
		return this
	}
}

let p = new TrackAblePromise((resolve, reject, notify) => {
	function countDown(x){
		if (x > 0) {
			notify(`${ 20 * x}% remaining`)
			setTimeout(() => countDown(x - 1), 1000)
		} else {
			resolve()
		}
	}
	countDown(5)
})

p.notify((x) => setTimeout(console.log, 0 , 'progress:', x))

p.then(() => console.log('completed'))
