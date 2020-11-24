---
title: 动态规划
---
#### 斐波那契数列

```javascript
/**
 * @param {number} N
 * @return {number}
 */
// 1、暴力递归

var fib = function(N){
	if (N < 1) return 0
	if (N <= 2) return 1
	return fib(N - 1) + fib(N - 2)
}

// 2、带备忘录的递归解法

var fib = function(N){
	const memo = [0, 1, 1]

	const fibonacci = (n, memo) => {
		if (memo[n] !== undefined) return memo[n]
		return memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
	}
	return fibonacci(N, memo)
}


// 3、dp 数组的迭代解法

var fib = function(N){
	const dp = new Array(N)
	dp[0] = 0
	dp[1] = dp[2] = 1
	if (N < 3) return dp[N]
	for (let i = 3; i <= N; i++) {
		dp[i] = dp[i - 1] + dp[i - 2]
	}
	return dp[N]
}

// 4、迭代解法

var fib = function(N){
	if (N === 0) return 0
	if (N === 1) return 1
	let prev = 0, curr = 1
	for (let i = 2; i <= N; i++) {
		let sum = prev + curr
		prev = curr
		curr = sum
	}

	return curr
}
```
