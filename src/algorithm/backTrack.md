# 回溯算法

- [全排列](#全排列)
- [子集](#子集)
- [N皇后](#n皇后)
- [组合总和](#组合总和)
- [单词搜索](#单词搜索)

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

## [全排列](https://leetcode-cn.com/problems/permutations/)

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

## [子集](https://leetcode-cn.com/problems/subsets/)
遇到一个数就把所有子集加上该数组成新的子集，遍历完毕即是所有子集
```javascript
var subsets = function(nums) {
    const res = []
    for(let i = 0; i < nums.length; i++) {
        let temp = []
        for(let j = 0; j < res.length; j++) {
            let item = [...res[j]]
            item.push(nums[i])
            temp.push(item)
        }
        res.push(...temp)
        res.push([nums[i]])
    }
    res.push([])
    return res
};
```
```javascript
const subsets = (nums) => {
  const res = [];

  const dfs = (index, list) => {
    if (index === nums.length) { // 指针越界
      res.push(list.slice());   // 加入解集
      return;                   // 结束当前的递归
    }
    list.push(nums[index]); // 选择这个数
    dfs(index + 1, list);   // 基于该选择，继续往下递归，考察下一个数
    list.pop();             // 上面的递归结束，撤销该选择
    dfs(index + 1, list);   // 不选这个数，继续往下递归，考察下一个数
  };

  dfs(0, []);
  return res;
};
```

## [N皇后](https://leetcode-cn.com/problems/n-queens/)
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

## [组合总和](https://leetcode-cn.com/problems/combination-sum/)

```javascript
const combinationSum = (candidates, target) => {
  const res = [];
  const dfs = (start, temp, sum) => { // start是当前选择的起点索引 temp是当前的集合 sum是当前求和
    if (sum >= target) {
      if (sum === target) {
        res.push(temp.slice()); // temp的拷贝 加入解集
      }
      return;   // 结束当前递归
    }
    for (let i = start; i < candidates.length; i++) { // 枚举当前可选的数，从start开始
      temp.push(candidates[i]);          // 选这个数
      dfs(i, temp, sum + candidates[i]); // 基于此继续选择，传i，下一次就不会选到i左边的数
      temp.pop();   // 撤销选择，回到选择candidates[i]之前的状态，继续尝试选同层右边的数
    }
  };
  dfs(0, [], 0); // 最开始可选的数是从第0项开始的，传入一个空集合，sum也为0
  return res;
};
```

## [单词搜索](https://leetcode-cn.com/problems/word-search/)
```javascript
// 链接：https://leetcode-cn.com/problems/word-search/solution/shou-hua-tu-jie-79-dan-ci-sou-suo-dfs-si-lu-de-cha/
const exist = (board, word) => {
    const m = board.length;
    const n = board[0].length;
    const used = new Array(m);    // 二维矩阵used，存放bool值
    for (let i = 0; i < m; i++) {
        used[i] = new Array(n);
    }
    // canFind 判断当前点是否是目标路径上的点
    const canFind = (row, col, i) => { // row col 当前点的坐标，i当前考察的word字符索引
        if (i == word.length) {        // 递归的出口 i越界了就返回true
            return true;
        }
        if (row < 0 || row >= m || col < 0 || col >= n) { // 当前点越界 返回false
            return false;
        }
        if (used[row][col] || board[row][col] != word[i]) { // 当前点已经访问过，或，非目标点
            return false;
        }
        // 排除掉所有false的情况，当前点暂时没毛病，可以继续递归考察
        used[row][col] = true;  // 记录一下当前点被访问了
        // canFindRest：基于当前选择的点[row,col]，能否找到剩余字符的路径。
        const canFindRest = canFind(row + 1, col, i + 1) || canFind(row - 1, col, i + 1) ||
            canFind(row, col + 1, i + 1) || canFind(row, col - 1, i + 1); 

        if (canFindRest) { // 基于当前点[row,col]，可以为剩下的字符找到路径
            return true;    
        }
        used[row][col] = false; // 不能为剩下字符找到路径，返回false，撤销当前点的访问状态
        return false;
    };

    for (let i = 0; i < m; i++) { // 遍历找起点，作为递归入口
      for (let j = 0; j < n; j++) {
        if (board[i][j] == word[0] && canFind(i, j, 0)) { // 找到起点且递归结果为真，找到目标路径
          return true; 
        }
      }
    }
    return false; // 怎么样都没有返回true，则返回false
};
```
