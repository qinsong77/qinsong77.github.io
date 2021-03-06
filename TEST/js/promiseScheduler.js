class Scheduler {
	constructor(count) {
		this.count = count
		this.runningCount = 0
		this.pendingTask= []
	}
	add(task) {
		return new Promise((resolve, reject) => {
			if (this.runningCount < this.count) {
				this.runningCount++
				task()
					.then(res => {
						resolve(res)
						this.runningCount--
						this.schedule()
					})
			} else {
				this.pendingTask.push({
					task,
					resolve,
					reject
				})
			}
		})
	}
	schedule() {
		if(this.pendingTask.length === 0) return
		const obj = this.pendingTask.shift()
		obj.task()
			.then(res => {
				obj.resolve(res)
				this.schedule()
			})
	}
}

// Usage
const timeout = (time) => new Promise(resolve => {
	setTimeout(resolve, time)
})
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
	scheduler.add(() => timeout(time))
		.then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
