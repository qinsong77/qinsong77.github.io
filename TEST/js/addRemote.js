// 假设本地机器无法做加减乘除法，需要通过远程请求让服务端来实现。
// 以加法为例，现有远程API的模拟实现
const addRemote = async (a, b) => new Promise(resolve => {
	setTimeout(() => resolve(a + b), 1000)
})

// 请实现本地的add方法，调用addRemote，能最优的实现输入数字的加法。
async function add(...inputs) {
	// 你的实现
	if(inputs.length === 1) return inputs[0]
	let sum = inputs[0]
	for(let i = 1; i < inputs.length; i++) {
		sum = await addRemote(sum, inputs[i])
		console.log(sum)
	}
	return sum
}

// 请用示例验证运行结果:
add(1, 2)
	.then(result => {
		console.log(result) // 3
	})

add(3, 5, 2)
	.then(result => {
		console.log(result) // 10
	})
