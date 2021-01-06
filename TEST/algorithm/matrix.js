var matrix = [[1,2,3],[4,5,6],[7,8,9]]
var rotate = function(matrix) {
	const n = matrix.length
	var map = new Map()
	// [col][n−row−1]
	for (var i = 0; i < n; i++) {
		for(var j =0; j < n; j++) {
			var key = j + '-' + (n - i -1)
			map.set(key, matrix[i][j])
		}
	}
	var res = []
	for (var i = 0; i < n; i++) {
		res[i] = []
		for(var j =0; j < n; j++) {
			var key = i + '-' + j
			res[i][j] = map.get(key)
		}
	}
	console.log(map)
	return res
};
console.log(matrix)
console.log(rotate(matrix))
