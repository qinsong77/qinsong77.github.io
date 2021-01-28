function twoSum(arr, target) {
	let i = 0
	while (i < arr.length) {
		const v = arr[i++]
		const findIndex = arr.indexOf(target - v, i)
		if (findIndex !== -1) return [i--, findIndex]
	}
	return [0, 0]
}
