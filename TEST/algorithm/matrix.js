var matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
var result1 = [
	[7, 4, 1],
	[8, 5, 2],
	[9, 6, 3]
]
var rotate = function(matrix){
	const n = matrix.length
	var map = new Map()
	// [col][n−row−1]
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			var key = j + '-' + (n - i - 1)
			map.set(key, matrix[i][j])
		}
	}
	var res = []
	for (var i = 0; i < n; i++) {
		res[i] = []
		for (var j = 0; j < n; j++) {
			var key = i + '-' + j
			res[i][j] = map.get(key)
		}
	}
	return res
}
// console.log(matrix)
// console.log(rotate(matrix))

var input = [[43,39,3,33,37,20,14],[9,18,9,-1,40,22,38],[14,42,3,23,12,14,32],[18,31,45,11,8,-1,31],[28,44,14,23,40,24,13],[29,45,33,45,20,0,45],[12,23,35,32,22,39,8]]
var result = [[12,29,28,18,14,9,43],[23,45,44,31,42,18,39],[35,33,14,45,3,9,3],[32,45,23,11,23,-1,33],[22,20,40,8,12,40,37],[39,0,24,-1,14,22,20],[8,45,13,31,32,38,14]]
var rotate2 = function(matrix){
	const n = matrix.length
	const map = new Map()
	// [col][n−row−1]
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const row = j
			const col = n - i - 1
			const key = row + '-' + col
			if (map.has(i + '-' + j)) {
				if (!map.has(key)) map.set(key, matrix[row][col])
				matrix[row][col] = map.get(i + '-' + j)
			} else {
				if (!map.has(key)) map.set(key, matrix[row][col])
				matrix[row][col] = matrix[i][j]
			}
		}
	}
	return matrix
}

var p = 0
function compare(a, b){
	const n = a.length
	let result = true
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < a[i].length; j++) {
			if (a[i][j] !== b[i][j]) {
				result = false
				break
			}
		}
	}
	return result
}

// console.log(compare(rotate2(matrix), result1))
console.log(compare(rotate2(input), result))

// 执行用时为 60 ms 的范例
var rotate3 = function (matrix) {
	//let newMatrix = []
	let len = matrix.length
	for (let l = 0; l < len; l++) {
		let newL = []
		for (let n = 0; n < len; n++) {
			newL.unshift(matrix[n][l])
		}
		matrix.push(newL)
		//newMatrix.push(newL)
		//console.log(newMatrix)
	}
	matrix.splice(0, matrix.length / 2)
	//matrix = newMatrix
};
