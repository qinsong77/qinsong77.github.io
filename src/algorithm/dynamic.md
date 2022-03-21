---
title: 动态规划
---
### 目录
- [斐波那契数列](#斐波那契数列)
- [打家劫舍](#打家劫舍)
- [凑零钱问题](#凑零钱问题)
- [爬楼梯](#爬楼梯)
- [单词拆分](#单词拆分)
- [0-1背包](#单词拆分)
  - [0-1背包问题的变体-分割等和子集](#分割等和子集)


动态规划问题的一般形式就是求最值。求解动态规划的核心问题是**穷举**。因为要求最值，肯定要把所有可行的答案穷举出来，然后在其中找最值。

动态规划的穷举有点特别，因为这类问题存在**「重叠子问题」**，如果暴力穷举的话效率会极其低下，所以需要「备忘录」或者「DP table」来优化穷举过程，避免不必要的计算。

而且，动态规划问题一定会具备「最优子结构」，才能通过子问题的最值得到原问题的最值。

穷举所有可行解其实并不是一件容易的事，只有列出正确的「状态转移方程」才能正确地穷举。

以上提到的**重叠子问题**、**最优子结构**、**状态转移方程**就是动态规划三要素。

状态转移方程是最困难的：明确「状态」 -> 定义 dp 数组/函数的含义 -> 明确「选择」-> 明确 base case。

dp解法一般是「自顶向下」，动态规划叫做「自底向上」。


#### 斐波那契数列
`F(0)=0，F(1)=1, F(n)=F(n - 1)+F(n - 2)（n ≥ 2，n ∈ N*）`
```javascript
/**
 * @param {number} N
 * @return {number}
 */
// 1、暴力递归，时间复杂度为 O(2^n)。

var fib = function(N){
	if (N < 1) return 0
	if (N <= 2) return 1
	return fib(N - 1) + fib(N - 2)
}

// 2、带备忘录的递归解法，记住重复子问题。时间复杂度是 O(n)

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

#### [打家劫舍](https://leetcode-cn.com/problems/house-robber/)

当位于i时，只能选择不偷或者偷，偷的话就是 `nums[i] + dp[i - 2]`，不偷则是前一步的最大值，`dp[i-1]`

dp 方程 `dp[i] = max(dp[i-2]+nums[i], dp[i-1])`
```javascript
var rob = function(nums) {
    if(nums.length === 0) return 0
    if(nums.length === 1) return nums[0]
    if(nums.length === 2) return Math.max(nums[0], nums[1])
    let prev1 = nums[0]
    let prev2 = Math.max(nums[0], nums[1])
    let curr = 0
    for(let i = 2; i < nums.length; i++) {
        curr = Math.max(prev2, nums[i] + prev1)
        prev1 = prev2
        prev2 = curr
    }
    return curr
};
```
#### [打家劫舍2](https://leetcode-cn.com/problems/house-robber-ii/)
条件只是变成所有的房屋都 **围成一圈** ， 即第一间房间和最后一间不能同时偷。

就是把环拆成两个队列，一个是从`0到n-1`，另一个是从`1到n`，然后返回`两个结果最大的`。
```javascript
var rob = function(nums) {
    const length = nums.length
    if(length === 1) return nums[0]
    if(length === 2) return Math.max(nums[0], nums[1])
    if(length === 3) return Math.max(...nums)
    return Math.max(robNotCircle(nums.slice(0, length -1)), robNotCircle(nums.slice(1)))
};

function robNotCircle(nums) {
    let prev1 = nums[0]
    let prev2 = Math.max(nums[0], nums[1])
    let curr = 0
    for(let i = 2; i < nums.length; i++) {
        curr = Math.max(prev2, prev1 + nums[i])
        prev1 = prev2
        prev2 = curr
    }
    return curr
}
```

### [凑零钱问题](https://leetcode-cn.com/problems/coin-change/)

给你k种面值的硬币，面值分别为c1, c2 ... ck，每种硬币的数量无限，再给一个总金额amount，问你最少需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1 。算法的函数签名如下：
```javascript
 // coins 中是可选硬币面值，amount 是目标金额
function coinChange(coins, amount){}
```

先确定「状态」，也就是原问题和子问题中变化的变量。由于硬币数量无限，所以唯一的状态就是目标金额amount。

然后确定dp函数的定义：函数 dp(n)表示，当前的目标金额是n，至少需要dp(n)个硬币凑出该金额。

然后确定「选择」并择优，也就是对于每个状态，可以做出什么选择改变当前状态。具体到这个问题，无论当的目标金额是多少，选择就是从面额列表coins中选择一个硬币，然后目标金额就会减少：

```java
# 伪码框架
def coinChange(coins: List[int], amount: int):
    # 定义：要凑出金额 n，至少要 dp(n) 个硬币
    def dp(n):
        # 做选择，需要硬币最少的那个结果就是答案
        for coin in coins:
            res = min(res, 1 + dp(n - coin))
        return res
    # 我们要求目标金额是 amount
    return dp(amount)
```
最后明确 `base case`，显然目标金额为 0 时，所需硬币数量为 0；当目标金额小于 0 时，无解，返回 -1：

```javascript
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
// 递归- 超出时间限制
var coinChange = function(coins, amount) {
    const dp = (n) => {
        if (n === 0) return 0
        if (n < 0) return -1
        let res = Infinity
        for(let i = 0; i < coins.length; i++) {
            const coin = coins[i]
            const subProblem = dp(n - coin)
            if (subProblem === -1) continue
            res = Math.min(res, 1 + subProblem) 
        }
        return res === Infinity ? -1 : res
    }
    return dp(amount)
};
// 递归加备忘录
var coinChange = function(coins, amount) {
    const memo = new Map()
    const dp = (n) => {
        if (memo.has(n)) return memo.get(n)
        if (n === 0) return 0
        if (n < 0) return -1
        let res = Infinity
        for(let i = 0; i < coins.length; i++) {
            const coin = coins[i]
            const subProblem = dp(n - coin)
            if (subProblem === -1) continue
            res = Math.min(res, 1 + subProblem) 
        }
        res === Infinity ? memo.set(n, -1) : memo.set(n, res)
        return memo.get(n)
    }
    return dp(amount)
};
// dp 数组的迭代解法

var coinChange = function(coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity)
    dp[0] = 0

    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1)
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount]
}
```
#### [爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)
动态规划思路： 要考虑第爬到第n阶楼梯时候可能是一步，也可能是两步。 
1. 计算爬上n-1阶楼梯的方法数量。因为再爬1阶就到第n阶 
2. 计算爬上n-2阶楼梯体方法数量。因为再爬2阶就到第n阶 那么f(n)=f(n-1)+f(n-2);
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if(n === 1) return 1
    if(n === 2) return 2
    let a = 1, b = 2
    for(let i = 3; i <= n; i++) {
        let temp = a + b
        a = b
        b = temp
    }
    return b
};
```
#### [单词拆分](https://leetcode-cn.com/problems/word-break/)
```javascript
var wordBreak = function(s, wordDict) {
    const { length } = s
    const dp = new Array(length + 1).fill(false)
    const set = new Set(wordDict)
    dp[0] = true
    for(let i = 1; i <= length; i++) {
        for(let j = i - 1; j >= 0; j--) {
            if (dp[i] === true) break;
            if (dp[j] === false) continue;
            const suffix = s.slice(j,i)
            if(set.has(suffix) && dp[j]) {
                dp[i] = true
                break
            }
        }
    }
    return dp[length]
};
```
### [0-1 背包问题](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247485064&idx=1&sn=550705eb67f5e71487c8b218382919d6&chksm=9bd7f880aca071962a5a17d0f85d979d6f0c5a5ce32c84b8fee88e36d451f9ccb3bb47b88f78&scene=21#wechat_redirect)

给你一个可装载重量为W的背包和N个物品，每个物品有重量和价值两个属性。其中第i个物品的重量为`wt[i]`，价值为`val[i]`，现在让你用这个背包装物品，最多能装的价值是多少？

举个简单的例子，输入如下：
```javascript
N = 3, W = 4
wt = [2, 1, 3]
val = [4, 2, 3]
```
算法返回 6，选择前两件物品装进背包，总重量 3 小于`W`，可以获得最大价值 6。
```javascript
function knapsack (W, N, wt, val) {
  const dp = Array.from(new Array(N + 1), () => new Array(W + 1).fill(0))
  for (let i = 1; i <= N; i++) {
    for (let w = 1; w <= W; w++) {
      if (w - wt[i - 1] < 0) {
        // 当前背包容量装不下，只能选择不装入背包
        dp[i][w] = dp[i - 1][w]
      } else {
        // 装入或者不装入背包，择优
        dp[i][w] = Math.max(dp[i - 1][w - wt[i - 1]] + val[i - 1],
          dp[i - 1][w])
      }
    }
  }
  return dp[N][W]
}
```
#### [分割等和子集](https://leetcode-cn.com/problems/partition-equal-subset-sum/)
[题解](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247485103&idx=1&sn=8a9752e18ed528e5c18d973dcd134260&chksm=9bd7f8a7aca071b14c736a30ef7b23b80914c676414b01f8269808ef28da48eb13e90a432fff&scene=21#wechat_redirect)
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
    let sum = nums.reduce((prev, curr) => prev + curr, 0)
    // 和为奇数时，不可能划分成两个和相等的集合
    if (sum % 2) return false
    const n = nums.length
    sum = sum/2
    const dp = Array.from(new Array(n+1), () => new Array(sum+1).fill(false))
    for(let i = 0; i <= n; i++) {
        dp[i][0] = true
    }

    for(let i = 1; i <=n; i++) {
        for(let j = 1; j <= sum;j++) {
            if(j - nums[i-1] < 0) {
                dp[i][j] = dp[i-1][j]
            } else {
                dp[i][j] = dp[i-1][j] || dp[i-1][j-nums[i-1]]
            }
        }
    }
    return dp[n][sum]
};
```
