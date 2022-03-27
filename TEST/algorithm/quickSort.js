
function quickSort(arr){
	return quick(arr, 0, arr.length - 1)
}

function quick(arr, left, right){
	if(left >= right) return arr;
	const target = arr[left]
	let i = left
	let j = right
	while (i < j) {
		while (i < j && arr[j] >= target) j--
		arr[i] = arr[j]
		while (i <j && arr[i] < target) i++
		arr[j] = arr[i]
	}
	arr[i] = target
	quick(arr, left, i -1)
	quick(arr, i + 1, right)
	return arr
}

console.log(quickSort([12,21,4,411,3,10,8]))


function delayPromise(time) {
	return new Promise((resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	}))
}
