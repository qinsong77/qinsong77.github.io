function insertSort(array) {
	const len = array.length
	for (let i = 0; i < len - 1; i++) {
		const v = array[i + 1]
		let j = i + 1
		while (j > 0) {
			j--
			if (v < array[j]) {
				[array[j], array[j + 1]] = [array[j + 1], array[j]]
			}
		}
	}
	return array
}

console.log(insertSort([21, 3, 4, 89, 12, 5]))


function mergeSort(arr) {
	if (arr.length > 1) {
		const mid = Math.floor((arr.length / 2))
		const left = mergeSort(arr.slice(0, mid))
		const right = mergeSort(arr.slice(mid))
		arr = merge(left, right)
	}
	return arr
}

function merge(left, right) {
	let i = 0, j = 0
	const result = []
	while (i < left.length && j < right.length) {
		result.push(left[i] < right[j] ? left[i++] : right[j++])
	}
	return result.concat(i < left.length ? left.slice(i) : right.slice(j))
}

console.log(mergeSort([21, 3, 4, 89, 12, 5]))


// console.log(quickSort([21, 3, 4, 89, 12, 5]))


// function mergeSort2(arr){
// 	if (arr.length > 1) {
// 		const stack = []
// 		for (let i = 0; i < arr.length; i++) {
// 			if (arr[++i] !== undefined) {
// 				stack.push([arr[i], arr[++i]])
// 			} else stack.push([arr[i]])
// 		}
// 		while (stack.length > 1) {
// 			const a = []
// 			let m = stack.shift()
// 			let n = stack.shift()
// 			while (m.length > 0 && n.length > 0) {
//
// 			}
// 			stack.unshift(a)
// 		}
// 		return stack[0]
// 	} else return arr
//
// }
//
// console.log(mergeSort2([21, 3, 4, 89, 12, 5,13]))

console.log(quickSort([3,12,43,7,34,56,36]))
function quickSort(arr) {
	return quick(arr, 0, arr.length -1)
}
function quick(arr, left, right) {
	let index
	if (arr.length > 1) {
		index = partition(arr, left, right)
		if (left < index -1) {
			quick(arr, left, index -1)
		}
		if (index < right) {
			quick(arr, index , right)
		}
	}
	return arr
}

function partition(arr, left, right) {
	const pivot = arr[Math.floor((left+right)/2)]

	let i = left
	let j = right
	while (i <=j) {
		while (arr[i] < pivot) {
			i ++
		}
		while (arr[j]>pivot) {
			j--
		}
		if (i <= j) {
			[arr[i], arr[j]] = [arr[j], arr[i]]
			i++
			j--
		}
	}
	return i
}

function shellSort(array) {
	const length = array.length;
	//间隔
	let gap = (length / 2) | 0;
	while (gap >= 1) {
		//以gap作为间隔分组，然后插入排序;
		for (let i = gap; i < length; i++) {
			let temp = array[i];
			let j = i;
			while (j > gap - 1 && array[j - gap] > temp) {
				array[j] = array[j - gap];
				j -= gap;
			}
			array[j] = temp;
		}
		gap = Math.floor(gap / 2);
	}
	return array
}
// console.log(shellSort([21, 3, 4, 89, 12, 5]))
