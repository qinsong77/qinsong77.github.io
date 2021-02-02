---
title: LeetCode
---

## 目录
- [1.两数之和](#_1-两数之和)
- [2.回文数](#_2-回文数)
- [3.字符串](#_3-字符串)
  - [最长回文子串](#最长回文子串)
  - [最长不含重复字符的子字符串](#最长不含重复字符的子字符串)
  - [最长公共前缀](#最长公共前缀)
  - [翻转字符串里的单词](#翻转字符串里的单词)
  - [字符串相加](#字符串相加)
  - [字符串相加](#字符串相加)
  - [字符串相乘](#字符串相乘)
  - [替换后的最长重复字符](#替换后的最长重复字符)
- [4.二维数组翻转90度](#_4-n-x-n二维数组翻转90度)
- [5.二叉树](#_5-二叉树)
   - [二叉树的层序遍历](#二叉树的层序遍历)
   - [二叉树的序列化与反序列化](#二叉树的序列化与反序列化)
   - [翻转二叉树](#翻转二叉树)
   - [填充每个节点的下一个右侧节点指针](#填充每个节点的下一个右侧节点指针)
   - [二叉树展开为链表](#二叉树展开为链表)
   - [最大二叉树](#最大二叉树)
   - [从前序与中序遍历序列构造二叉树](#最大二叉树)
   - [从中序与后序遍历序列构造二叉树](#最大二叉树)
   - [寻找重复的子树](#寻找重复的子树)
   - [求二叉树中最大路径和](#求二叉树中最大路径和)
- [6.二叉搜索树](#_6-二叉搜索树)
   - [二叉搜索树中第K小的元素](#二叉搜索树中第k小的元素)
   - [把二叉搜索树转换为累加树](#把二叉搜索树转换为累加树)
   - [判断BST的合法性](#判断bst的合法性)
- [7.链表](#_6-链表)
   - [反转链表](#反转链表)
- [8.最长递增子序列](#_7-最长递增子序列)
- [9.数组](#_9-数组)
 - [连续子数组的最大和](#连续子数组的最大和)

获取26个字母
```javascript
const letters = []
for (let i = 0; i < 26; i++) {
        letters.push(String.fromCharCode((97 + i)));
    }
const bigLetters = []
for (let i = 0; i < 26; i++) {
        bigLetters.push(String.fromCharCode((65 + i)));
    }
```

Math 对象方法

- `Math.floor(x)`: 向下取证。
- `Math.ceil(x)`: 向上取证。
- `Math.round(x)`: 把数四舍五入为最接近的整数。

#### 1.[两数之和](https://leetcode-cn.com/problems/two-sum )
> 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。  <br />你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
  
  ***
  给定 nums = [2, 7, 11, 15], target = 9  
  
  因为 nums[0] + nums[1] = 2 + 7 = 9  
  所以返回 [0, 1] 

  *** 
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let s = 0, e = 0
    for(let i = 0; i < nums.length; i++) {
        if (s + e > 0) break
        for (let j = i + 1; j < nums.length; j++ ) {
            if (nums[i] + nums[j] === target) {
                s = i, e= j
                break
            }
        }
    }
    return [s, e]
};
```
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let i = nums.length;
    while(i > 1) {
        let last = nums.pop();
        if (nums.indexOf(target - last) > -1) {
            return [nums.indexOf(target - last), nums.length]
        }
        i--
    }
};
```

#### 2.[回文数](https://leetcode-cn.com/problems/palindrome-number/)
> 判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
  
  ***
  示例 1:    
  
  输入: 121  
  输出: true  

  *** 
```javascript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0) return false
    if (x === 0) return true
    return x === parseInt(String(x).split('').reverse().join(''))
};
```

[官方题解](https://leetcode-cn.com/problems/palindrome-number/solution/hui-wen-shu-by-leetcode-solution/)
```typescript
var isPalindrome = function(x: number): boolean {
    // 特殊情况：
    // 如上所述，当 x < 0 时，x 不是回文数。
    // 同样地，如果数字的最后一位是 0，为了使该数字为回文，
    // 则其第一位数字也应该是 0
    // 只有 0 满足这一属性
    if (x < 0 || (x % 10 === 0 && x !== 0)) {
        return false;
    }

    let revertedNumber: number = 0;
    while (x > revertedNumber) {
        revertedNumber = revertedNumber * 10 + x % 10;
        x = Math.floor(x / 10);
    }

    // 当数字长度为奇数时，我们可以通过 revertedNumber/10 去除处于中位的数字。
    // 例如，当输入为 12321 时，在 while 循环的末尾我们可以得到 x = 12，revertedNumber = 123，
    // 由于处于中位的数字不影响回文（它总是与自己相等），所以我们可以简单地将其去除。
    return x === revertedNumber || x === Math.floor(revertedNumber / 10);
};
```

## 3.字符串

#### [最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

回文串就是正着读和反着读都一样的字符串。

```javascript
// https://labuladong.gitbook.io/algo/gao-pin-mian-shi-xi-lie/zui-chang-hui-wen-zi-chuan
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let res = ''
    for (let i = 0; i < s.length; i++) {
        let s1 = palidrome(s, i, i)
        let s2 = palidrome(s, i, i+1)
        let temp = (s1.length > s2.length ? s1 : s2 )
        res =  temp.length > res.length ? temp : res
    }
    return res
};

function palidrome (s, l, r) {
    while(l > -1 && r < s.length && s[l] === s[r]) {
        l--
        r++
    }
    return s.slice(l+1, r)
}
```

#### [最长不含重复字符的子字符串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

滑动窗口解法，可以维护一个数组或下标

![](./leetcode_img/str1.png)
 ::: details 点击查看代码
```javascript
var lengthOfLongestSubstring = function(s) {
    let arr = [], max = 0
    for(let i = 0; i < s.length; i++) {
        let index = arr.indexOf(s[i])
        if(index !== -1) {
            arr.splice(0, index+1);
        }
        arr.push(s.charAt(i))
        max = Math.max(arr.length, max) 
    }
    return max
};

var lengthOfLongestSubstring = function(s) {
    let index = 0, max = 0
    for(let i = 0, j = 0; j < s.length; j++) {
        index = s.substring(i, j).indexOf(s[j]) 
        if(index !== -1) { 
            i = i + index + 1 
        } 
        max = Math.max(max, j - i + 1) 
    }
    return max
};

var lengthOfLongestSubstring = function(s) {
    let map = new Map(), max = 0
    for(let i = 0, j = 0; j < s.length; j++) {
        if(map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i)
        }
        max = Math.max(max, j - i + 1)
        map.set(s[j], j)
    }
    return max
};

// https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/solution/zi-jie-leetcode3wu-zhong-fu-zi-fu-de-zui-chang-zi-/
```
 ::: 
 
#### [最长公共前缀](https://leetcode-cn.com/problems/longest-common-prefix/)

 ::: details 点击查看代码
```javascript
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if (strs.length === 0) return ''
    let result = strs[0]

    for (let i=0;i < strs.length;i++) {
        while(result) {
            if ((strs[i].length >= result.length) && (strs[i].slice(0, result.length) === result)) break;
            result = result.slice(0, result.length -1)
        }
        if (result === '') break;
    }

    return result
};
```
 ::: 
 
 #### [翻转字符串里的单词](https://leetcode-cn.com/problems/reverse-words-in-a-string/)
 
  ::: details 点击查看代码
 ```javascript
 var reverseWords = function(s) {
     let result = s.split(' ').filter(v => v && v.trim())
     return result.reverse().join(' ')
 };
 
 var reverseWords = function(s) {
     return s.trim().split(/\s+/).reverse().join(' ');
 };
 ```
  :::  
#### [字符串相加](https://leetcode-cn.com/problems/add-strings/)
 
 [题解](https://github.com/sisterAn/JavaScript-Algorithms/issues/32)
  ::: details 点击查看代码
 ```javascript
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function(num1, num2) {
    let i = num1.length, j = num2.length, temp = 0, result = ''
    let res = ''
    while(i || j) {
        i ? temp += +num1[--i] : ''
        j ? temp += +num2[--j] : ''
        result = temp % 10 + result
        if (temp > 9) temp = 1
        else temp = 0
    }
    if (temp) result = 1 + result
    return result
};
 ```
  ::: 
  
#### [字符串相乘](https://leetcode-cn.com/problems/multiply-strings/)

[题解](https://github.com/sisterAn/JavaScript-Algorithms/issues/105)

::: details 点击查看代码
```javascript
let multiply = function(num1, num2) {
    if(num1 === '0' || num2 === '0') return "0"
    
    // 用于保存计算结果
    let res = []
    
    // 从个位数开始逐位相乘
    for(let i = 0 ; i < num1.length; i++){
        // num1 尾元素
        let tmp1 = +num1[num1.length-1-i]
        
        for(let j = 0; j < num2.length; j++){
            // num2尾元素
            let tmp2 = +num2[num2.length-1-j]
            
            // 判断结果集索引位置是否有值
            let pos = res[i+j] ? res[i+j]+tmp1*tmp2 : tmp1*tmp2
            // 赋值给当前索引位置
            res[i+j] = pos%10
            // 是否进位 这样简化res去除不必要的"0"
            pos >=10 && (res[i+j+1]=res[i+j+1] ? res[i+j+1]+Math.floor(pos/10) : Math.floor(pos/10));
        }
    }
    return res.reverse().join("");
}
```
::: 

#### [替换后的最长重复字符](https://leetcode-cn.com/problems/longest-repeating-character-replacement/)

````javascript

````
    
#### [4.N x N二维数组翻转90度](https://leetcode-cn.com/problems/rotate-image)
```dotenv
给定 matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],

原地旋转输入矩阵，使其变为:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
```
对于矩阵中第 ii 行的第 jj 个元素，在旋转后，它出现在倒数第 ii 列的第 jj 个位置。由于矩阵中的行列从 00 开始计数，因此对于矩阵中的元素 `matrix[row][col]`，在旋转后，它的新位置为 `[col][n−row−1]`。
```javascript
var rotate = function(matrix) {
    const n = matrix.length
    var map = new Map()
    // [col][n−row−1]
    for (var i = 0; i < n; i++) {
        for(var j =0; j < n; j++) {
            var key = j + '&' + (n - i -1)
            map.set(key, matrix[i][j])
        } 
    }
    for (var i = 0; i < n; i++) {
        for(var j =0; j < n; j++) {
            var key = i + '&' + j
            matrix[i][j] = map.get(key)
        } 
    }
};

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
}
```
先以对角线（左上<—>右下）为轴进行翻转，再对每行左右翻转即可。
```javascript
var rotate = function(matrix) {
    const n = matrix.length
    for (let i = 0; i < n; i++) {
        for(let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] =  [matrix[j][i], matrix[i][j]]
        } 
    }
    const mid = Math.floor(n/2)
    for (let i = 0; i < n; i++) {
        for(let j = 0; j < mid; j++) {
            [matrix[i][j], matrix[i][n - 1 - j]] =  [matrix[i][n - 1 - j], matrix[i][j]]
        } 
    }
};
```

执行用时为 60 ms 的范例
```javascript
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
```

### 5.二叉树
做二叉树的问题，关键是把题目的要求细化，搞清楚根节点应该做什么，然后剩下的事情抛给前/中/后序的遍历框架就行了。
```javascript
/* 二叉树遍历框架 */
function traverse(root) {
    if (root == null) return;
    // 前序遍历
    traverse(root.left)
    // 中序遍历
    traverse(root.right)
    // 后序遍历
}
```
中序遍历的非递归实现
```javascript
// https://leetcode-cn.com/problems/convert-bst-to-greater-tree/solution/shou-hua-tu-jie-zhong-xu-bian-li-fan-xiang-de-by-x/
const inorderTraversal = (root) => {
  const res = [];
  const stack = [];

  while (root) {        // 能压入栈的左子节点都压进来
    stack.push(root);
    root = root.left;
  }
  while (stack.length) {
    let node = stack.pop(); // 栈顶的节点出栈
    res.push(node.val);     // 在压入右子树之前，处理它的数值部分（因为中序遍历）
    node = node.right;      // 获取它的右子树
    while (node) {          // 右子树存在，执行while循环    
      stack.push(node);     // 压入当前root
      node = node.left;     // 不断压入左子节点
    }
  }
  return res;
};
```

### [二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(root == null) return []
    let queue = [root]
    const res = []
    while(queue.length) {
        const nodesLevels = []
        const newQueue = []
        queue.forEach(node => {
            nodesLevels.push(node.val)
            if (node.left) newQueue.push(node.left)
            if (node.right) newQueue.push(node.right)
        })
        res.push(nodesLevels)
        queue = newQueue
    }
    return res
};
```

### [二叉树的序列化与反序列化](https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/)

前序遍历法，后续遍历法差不多一样，而中序遍历的方式行不通，因为无法实现反序列化方法`deserialize`。
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */

const splitStr = ','
const nullStr = '#'

var serialize = function(root) {
    let res = ''
    

    function help(node) {
        if(node === null) {
            res = res  + nullStr + splitStr
            return
        }
        res = res  + node.val + splitStr
        help(node.left)
        help(node.right)
    }

    help(root)

    return res.slice(0, res.length - 1)  // 末尾多一个,
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    const nodes = data.split(splitStr)

    function help(nodes) {
        if (nodes.length === 0) return null
        const node = nodes.shift()
        if (node === nullStr) return null
        const root = new TreeNode(parseInt(node))
        root.left = help(nodes)
        root.right = help(nodes)
        return root
    }

    return help(nodes)
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```

### [翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)
![](./image/leetcode_tree/reverse_tree.png)
```javascript
var invertTree = function(root) {
    if (root === null) return null
    let temp = root.left
    root.left = root.right
    root.right = temp
    invertTree(root.right)
    invertTree(root.left)
    return root
};
```

### [填充每个节点的下一个右侧节点指针](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

```javascript
var connect = function(root) {
    if(root === null) return null
    connectTowNode(root.left, root.right)
    return root
};

function connectTowNode(left, right) {
    if (left === null || right === null) {
        return
    }
    left.next = right
    connectTowNode(left.left,left.right)
    connectTowNode(right.left,right.right)
    connectTowNode(left.right, right.left)
}
```

#### [二叉树展开为链表](https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/)

![](./image/leetcode_tree/tree1.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    if (root === null) return null
    flatten(root.left)
    flatten(root.right)
    let left = root.left, right = root.right
    root.right = left
    root.left = null
    let node = root
    while(node.right !== null) {
        node = node.right
    }
    node.right = right
};

var flatten2 = function(root) {
    while(root){
      let p=root.left;
      if(p){
        while(p.right) p=p.right;
        p.right=root.right;
        root.right=root.left;
        root.left=null
      }
      root=root.right;
    }
    
};
// 链接：https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/solution/114er-cha-shu-zhan-kai-wei-lian-biao-chao-jian-dan/
```


#### [最大二叉树](https://leetcode-cn.com/problems/maximum-binary-tree/)

```javascript
var constructMaximumBinaryTree = function(nums) {
    if(nums.length === 0) return null
    const [max, leftArray, rightArray] = getBuildResult(nums)
    const root = new TreeNode(max)
    root.left = constructMaximumBinaryTree(leftArray)
    root.right = constructMaximumBinaryTree(rightArray)
    return root
};

function getBuildResult(arr) {
    const max = Math.max(...arr)
    const maxIndex = arr.findIndex(v => v === max)
    return [
        max,
        arr.slice(0, maxIndex),
        arr.slice(maxIndex+1)
    ]
}
```

#### [从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
先构造根节点，接着思考如何构造左右节点，而构造左右节点也是构造根节点。剩下的就是分割数组
```javascript
var buildTree = function(preorder, inorder) {
    if (preorder.length === 0) return null
    const root = new TreeNode(preorder[0])
    const inorderRootIndex = inorder.findIndex(v => v === preorder[0])
    root.left = buildTree(preorder.slice(1,inorderRootIndex + 1), inorder.slice(0, inorderRootIndex)) 
    root.right = buildTree(preorder.slice(inorderRootIndex+1), inorder.slice(inorderRootIndex+1))
    return root
};
```

#### [通过后序和中序遍历结果构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

#### [寻找重复的子树](https://leetcode-cn.com/problems/find-duplicate-subtrees/)
1.拼接字符串使二叉树序列化

2.用Map存放每个子树以及出现的次数

3.递归得到所有的子树
```javascript
var findDuplicateSubtrees = function(root) {
    const treeMap = new Map()
    const result = []
    function traversal(root) {
        if(!root) {
            return '#'
        }
        const left = traversal(root.left)
        const right = traversal(root.right)
        const subtree = `${left},${right},${root.val}`
        if(treeMap.get(subtree)) {
            treeMap.set(subtree, treeMap.get(subtree)+1)
        } else {
            treeMap.set(subtree, 1)
        }
        if(treeMap.get(subtree) === 2) {
            result.push(root)
        }
        return subtree
    }
    traversal(root)
    return result
};
```
2. 二分查找
```javascript

```

#### [求二叉树中最大路径和](https://leetcode-cn.com/problems/binary-tree-maximum-path-sum/)

```javascript
var maxPathSum = function(root) {
    let res = -Infinity
    function help(node) {
        if (node === null) return 0
        let left = Math.max(0, help(node.left))
        let right = Math.max(0, help(node.right))
        res = Math.max(res, left + right + node.val)
        return Math.max(left, right) + node.val
    }
    help(root)
    return res
};
```

### 6.二叉搜索树

BST(Binary Search Tree) 的特性

1. 对于 BST 的每一个节点node，左子树节点的值都比node的值要小，右子树节点的值都比node的值大。
2. 对于 BST 的每一个节点node，它的左侧子树和右侧子树都是 BST。

从做算法题的角度来看 BST，除了它的定义，还有一个重要的性质：**BST 的中序遍历结果是有序的（升序）**。

```typescript jsx
interface TreeNode {
  left: null | TreeNode,
  right: null | TreeNode,
  val: number
}
function traverse(root:TreeNode) {
    if (root == null) return;
    traverse(root.left);
    // 中序遍历代码位置
    console.log(root.val);
    traverse(root.right);
}
```

#### [二叉搜索树中第K小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/)
给定一个二叉搜索树，编写一个函数 kthSmallest 来查找其中第 k 个最小的元素。
```javascript
var kthSmallest = function(root, k) {
    let count = 0
    let res = 0
    function help(node, k) {
        if (node === null) return
        help(node.left, k)
        count++
        if(count === k) {
            res = node.val
            return
        }
        help(node.right, k)
    }
    help(root, k)
    return res
};
```
迭代
```javascript
let kthSmallest = function(root, k) {
    let stack = []
    let node = root
    
    while(node || stack.length) {
        // 遍历左子树
        while(node) {
            stack.push(node)
            node = node.left
        }
      
        node = stack.pop()
        if(--k === 0) {
            return node.val
        }
        node = node.right
    }
    return null
}
```

#### [把二叉搜索树转换为累加树](https://leetcode-cn.com/problems/convert-bst-to-greater-tree/)

```javascript
var convertBST = function(root) {
    let prevSum = 0
    function help(node) {
        if (node === null) return
        help(node.right)
        node.val = node.val + prevSum
        prevSum = node.val
        help(node.left)
    }
    help(root)
    return root
};
```

迭代版本
```javascript
var convertBST1 = function(root) {
    if (root === null) return null
    let prevSum = 0
    let stack = []
    let curr = root
    while(curr) {
        stack.push(curr)
        curr = curr.right
    }
    while(stack.length) {
        let node = stack.pop()
        node.val = node.val + prevSum
        prevSum = node.val
        node = node.left
        while(node) {
            stack.push(node)
            node = node.right
        }
    }
    return root
};

const convertBST = (root) => {
  let sum = 0;
  let stack = [];
  let cur = root;

  while (cur) {  // 右子节点先不断压栈
    stack.push(cur);
    cur = cur.right;
  }

  while (stack.length) {  // 一直到清空递归栈
    cur = stack.pop();    // 位于栈顶的节点出栈
    sum += cur.val;       // 做事情
    cur.val = sum;        // 做事情
    cur = cur.left;       // 找左子节点
    while (cur) {         // 存在，让左子节点压栈
      stack.push(cur);    // 
      cur = cur.right;    // 让当前左子节点的右子节点不断压栈
    }
  }

  return root;
};
```

#### [判断BST的合法性](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247488128&idx=2&sn=b8fb3fd2917f9ac86127054741cd5877&chksm=9bd7ec88aca0659ee0185b657663169169493e9df2063fa4d28b38a0b4d0dd698d0301937898&scene=21#wechat_redirect)
```javascript
function isValidBST(root) {
  /* 限定以 root 为根的子树节点必须满足 max.val > root.val > min.val */
  function isValidBST(root, min, max) {
    // base case
    if (root === null) return true
    // 若 root.val 不符合 max 和 min 的限制，说明不是合法 BST
    if (min !== null && root.val <= min.val) return false
    if (max !== null && root.val >= max.val) return false
    return isValidBST(root.left, min, root) && isValidBST(root.right, root, max)
  }

  return isValidBST(root, null, null)
}
```

#### 在BST中搜索一个数

```javascript
function isInBST(root, target) {
  if (root === null) return true
  if (root.val === target) return true
  if (root.val > target) return isInBST(root.left, target)
  if (root.val < target) return isInBST(root.right, target)
}
```

### 7.链表

#### [反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

```javascript
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
};
```

### 8.[最长递增子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)
就是给定一个无序的数组，在这个数组中找出，递增并且最长的子数组

1.动态规划，状态转移方程`dp[i] = Max(dp[i],dp[j]+1)`
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    const { length } = nums
    if (!length) return 0
    let dp = new Array(length).fill(1)
    for (let i = 1; i < length; i++) {
        for(let j = 0;j < i;j++){
            if(nums[j] < nums[i]){
                dp[i] = Math.max(dp[i],dp[j]+1);
            }
        }
    }
    return Math.max(...dp)
};
```

#### [扑克牌中的顺子](https://leetcode-cn.com/problems/bu-ke-pai-zhong-de-shun-zi-lcof/)

## 9.数组

### [连续子数组的最大和](https://leetcode-cn.com/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/)
暴力求解：时间复杂度O(n^2),空间复杂度O(1)
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    var max = -Infinity
    for(let i = 0; i < nums.length; i++) {
        max = Math.max(max, nums[i])
        let prev = nums[i]
        for (let j = i + 1; j < nums.length; j++) {
            prev = prev + nums[j]
            max = Math.max(max, prev)
        }
    }
    return max
};
```
动态规划: 连续数组，每次循环包括自身，比较自身和i-1的最大连续数组和，得到i的最大连续数组和
```javascript
// https://leetcode-cn.com/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/solution/mian-shi-ti-42-lian-xu-zi-shu-zu-de-zui-da-he-do-2/
var maxSubArray = function(nums) {
    let max = nums[0]
    for(let i = 1; i < nums.length; i++) {
        nums[i] = Math.max(nums[i], nums[i] + nums[i-1])
        max = Math.max(nums[i], max)
    }
    return max
};
```
