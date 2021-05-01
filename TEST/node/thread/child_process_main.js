const { fork } = require('child_process')
const worker = fork(__dirname + '/child_process_worker.js')
var numCPUs = require('os').cpus().length

// 接收工作进程计算结果
let max = 1e7
let min = 2
let start = 2
let primes = []

const range = Math.ceil((max - min) / numCPUs)

for (var i = 0; i < numCPUs; i++) {
	worker.send({ start: start, range: range })
	start += range
	worker.on('message', (msg) => {
		primes = primes.concat(msg.data)
		worker.kill()
	})
}
