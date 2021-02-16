---
title: 回溯算法
---


解决一个回溯问题，实际上就是**一个决策树的遍历过程**。只需要思考 3 个问题：

1. **路径**：也就是已经做出的选择。

2. **选择列表**：也就是你当前可以做的选择。

3. **结束条件**：也就是到达决策树底层，无法再做选择的条件。

回溯算法的框架：

```javascript
const result = []

function backTrack(路径, 选择列表) {
  if 满足结束条件:
          result.push(路径)
          return
  
  for 选择 in 选择列表:
      做选择
      backtrack(路径, 选择列表)
      撤销选择
}
```
**其核心就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」**

### [全排列](https://leetcode-cn.com/problems/permutations/)

时间复杂度 O(N!)
```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */

var permute = function(nums) {
    const res = []
    backtrack([])

    function backtrack(track) {
        if (track.length === nums.length) {
            res.push([...track])
            return
        }

        for (let i = 0; i < nums.length; i++) {
            if (track.includes(nums[i])) continue
            track.push(nums[i])
            backtrack(track)
            track.pop()
        }
    }

    return res
};
```

### [N皇后](https://leetcode-cn.com/problems/n-queens/)
回溯的套路：

遍历枚举出所有可能的选择。

依次尝试这些选择：作出一种选择，并往下递归。

如果这个选择产生不出正确的解，要撤销这个选择（将当前的 "Q" 恢复为 "."），回到之前的状态，并作出下一个可用的选择。

是一个选择、探索、撤销选择的过程。识别出死胡同，就回溯，尝试下一个点，不做无效的搜索。

```javascript
// https://leetcode-cn.com/problems/n-queens/solution/shou-hua-tu-jie-cong-jing-dian-de-nhuang-hou-wen-t/
const solveNQueens = (n) => {
  const board = new Array(n);
  for (let i = 0; i < n; i++) {
    board[i] = new Array(n).fill('.');
  }

  const cols = new Set();  // 列集，记录出现过皇后的列
  const diag1 = new Set(); // 正对角线集
  const diag2 = new Set(); // 反对角线集
  const res = [];

  const helper = (row) => {
    if (row == n) {
      const stringsBoard = board.slice();
      for (let i = 0; i < n; i++) {
        stringsBoard[i] = stringsBoard[i].join('');
      }
      res.push(stringsBoard);
      return;
    }
    for (let col = 0; col < n; col++) {
      // 如果当前点的所在的列，所在的对角线都没有皇后，即可选择，否则，跳过
      if (!cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col)) { 
        board[row][col] = 'Q';  // 放置皇后
        cols.add(col);          // 记录放了皇后的列
        diag1.add(row + col);   // 记录放了皇后的正对角线
        diag2.add(row - col);   // 记录放了皇后的负对角线
        helper(row + 1);
        board[row][col] = '.';  // 撤销该点的皇后
        cols.delete(col);       // 对应的记录也删一下
        diag1.delete(row + col);
        diag2.delete(row - col);
      }
    }
  };
  helper(0);
  return res;
};
```
