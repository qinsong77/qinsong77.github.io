---
title: LeetCode
---

[内涵字节真题](https://github.com/sisterAn/JavaScript-Algorithms)

## 目录
- [1.两数之和](#_1-两数之和)
- [2.回文数](#_2-回文数)
- [3.字符串](#_3-字符串)
  - [括号序列](#括号序列)
  - [最长回文子串](#最长回文子串)
  - [最长不含重复字符的子字符串](#最长不含重复字符的子字符串)
  - [最长公共前缀](#最长公共前缀)
  - [翻转字符串里的单词](#翻转字符串里的单词)
  - [字符串相加](#字符串相加)
  - [字符串相加](#字符串相加)
  - [字符串相乘](#字符串相乘)
  - [替换后的最长重复字符](#替换后的最长重复字符)
  - [最长公共子序列](#最长公共子序列)
  - [最小覆盖子串](#最小覆盖子串)
- [4.二叉树](#_4-二叉树)
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
- [5.二叉搜索树](#_5-二叉搜索树)
   - [二叉搜索树中第K小的元素](#二叉搜索树中第k小的元素)
   - [把二叉搜索树转换为累加树](#把二叉搜索树转换为累加树)
   - [恢复二叉搜索树](#恢复二叉搜索树)
   - [判断BST的合法性](#判断bst的合法性)
- [6.链表](#_6-链表)
   - [反转链表](#反转链表)
   - [环形链表](#环形链表)
   - [链表中环的入口节点](#链表中环的入口节点)
   - [链表的中间结点](#链表的中间结点)
   - [寻找链表的倒数第k个元素](#寻找链表的倒数第k个元素)
   - [k个一组翻转链表](#k个一组翻转链表)
   - [合并有序链表](#合并有序链表)
   - [链表求和](#链表求和)
- [7.动态规划](#_7-动态规划)
   - [凑零钱问题](#凑零钱问题)
   - [最长递增子序列](#最长递增子序列)
- [8.数组](#_8-数组)
   - [连续子数组的最大和](#连续子数组的最大和)
   - [合并两个有序数组](#合并两个有序数组)
   - [全排列](#全排列)
   - [最长湍流子数组](#最长湍流子数组)
   - [全排列](#全排列)
- [9.二维数组](#_9-二维数组)
    - [二维数组翻转90度](#n-x-n二维数组翻转90度)
    - [二维数组中的查找](#二维数组中的查找)
- [二分查找](#二分查找)
- [扑克牌中的顺子](#扑克牌中的顺子)
- [扁平化嵌套列表迭代器](#扁平化嵌套列表迭代器)

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

#### [括号序列](https://leetcode-cn.com/problems/valid-parentheses/) 
使用栈
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = []
    for(let i = 0; i < s.length;i++) {
        const char = s[i]
        if(char === '(') stack.push(')')
        else if(char === '{') stack.push('}')
        else if(char === '[') stack.push(']')
        else if(stack.length === 0 || stack.pop() !== char) return false
    }
    return stack.length === 0
};
```
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

var lengthOfLongestSubstring = function(s) {
    if(!s) return 0
    let res = 1
    let prev = 1
    let lastIndex = 0
    for(let i = 1; i< s.length; i++) {
        let findIndex = s.slice(lastIndex, i).indexOf(s[i])
        if(findIndex > -1) {
            prev = i - findIndex - lastIndex
            lastIndex = findIndex + 1 + lastIndex
        } else {
            prev = prev + 1
        }
        res = Math.max(prev, res)
    }
    return res
};
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
/**
如: s = "AABABBA", k = 1

max 记录窗口内相同字符最多的次数

遍历字符串, 窗口往右扩张
一旦 窗口大小 大于 max + k, 则窗口左边收缩 (因为窗口内最多可替换 k个其他字符 为 出现最多的字符)

窗口扩张: left: 0, right: 0, 窗口: [ A ]ABABBA
窗口扩张: left: 0, right: 1, 窗口: [ AA ]BABBA
窗口扩张: left: 0, right: 2, 窗口: [ AAB ]ABBA
窗口扩张: left: 0, right: 3, 窗口: [ AABA ]BBA
移动左边: left: 1, right: 4, 窗口: A[ ABAB ]BA
移动左边: left: 2, right: 5, 窗口: AA[ BABB ]A
移动左边: left: 3, right: 6, 窗口: AAB[ ABBA ] 

遍历完后, 只要看窗口大小即可
**/
var characterReplacement = function(s, k) {
    if (!s) return 0
    let max = 0
    let left = 0
    let right = 1
    const map = new Map([[s[0], 1]])
    while(right < s.length) {
        const char = s[right]
        if(map.has(char)) map.set(char, map.get(char) +1)
        else map.set(char, 1)
        max = Math.max(max, map.get(char))
        if(right - left + 1 > max + k) {
            map.set(s[left], map.get(s[left]) - 1)
            left++
        }
        right++
    }
    return s.length - left
};

/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function(s, k) {
    if (!s) return 0
    let codes = Array(26).fill(0)  // 记录窗口内各字符出现次数
    let i = 0
    let max = 0
    for(let j = 0; j < s.length; j++){
        let n = s[j].charCodeAt() - 65
        codes[n] += 1
        max = Math.max(max, codes[n])
        if (j - i + 1 > max + k) {  // 移动左边
            codes[ s[i].charCodeAt() - 65 ] -= 1
            i++
        } 
    }
    return s.length - i
};
/**
作者：shetia
链接：https://leetcode-cn.com/problems/longest-repeating-character-replacement/solution/ti-huan-hou-de-zui-chang-zhong-fu-zi-fu-a6fuv/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
**/
````

#### [最长公共子序列](https://leetcode-cn.com/problems/longest-common-subsequence/)
```javascript
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
    let n = text1.length;
    let m = text2.length;
    let dp = Array.from(new Array(n+1),() => new Array(m+1).fill(0));
    for(let i = 1;i <= n;i++){
        for(let j = 1;j <= m;j++){
            if(text1[i-1] == text2[j-1]){
                dp[i][j] = dp[i-1][j-1] + 1;
            }else{
                dp[i][j] = Math.max(dp[i][j-1],dp[i-1][j]);
            }
        }
    }
    return dp[n][m];
};

// 链接：https://leetcode-cn.com/problems/longest-common-subsequence/solution/1143-zui-chang-gong-gong-zi-xu-lie-by-alexer-660/
```
#### [最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/)
难度：困难
```javascript
// https://leetcode-cn.com/problems/minimum-window-substring/solution/js-hua-dong-chuang-kou-by-jsyt/
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    let windows = {}, needs = {}, l = 0, r = 0, count = 0, start = -1, minLen = Infinity;
    [...t].forEach(c => needs[c] ? needs[c]++ : needs[c] = 1)
    let keyLen = Object.keys(needs).length;
    while (r < s.length) {
        let c1 = s[r++];
        windows[c1] ? windows[c1]++ : windows[c1] = 1;
        if (windows[c1] === needs[c1]) count++;
        while(count === keyLen) {
            if (r - l < minLen) {
                start = l;
                minLen = r - l;
            }
            let c2 = s[l++];
            if (windows[c2]-- === needs[c2]) count--;
        }
    }
    return start === -1 ? "" : s.substr(start, minLen)
};
```

### 4.二叉树
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

### 5.二叉搜索树

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

#### [恢复二叉搜索树](https://leetcode-cn.com/problems/recover-binary-search-tree/)

```javascript
// https://leetcode-cn.com/problems/recover-binary-search-tree/solution/tu-jie-hui-fu-yi-ge-er-cha-sou-suo-shu-by-hyj8/
var recoverTree = function(root) {
    let prev = new TreeNode(-Infinity)
    let err1 = null, err2 = null

    function trverseTree(node) {
        if(node === null) return
        trverseTree(node.left)
        if(err1 === null && prev.val > node.val) {
            err1 = prev
        }  
        if(err1 !== null && prev.val > node.val) {
            err2 = node
        }
        prev = node
        trverseTree(node.right)
    }

    trverseTree(root)
    let temp = err1.val
    err1.val = err2.val
    err2.val = temp
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

### 6.链表

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

#### [环形链表](https://leetcode-cn.com/submissions/detail/144460090/)
快慢指针
```js
var hasCycle = function(head) {
    // 使用hash表，时间复杂度O(n)，空间复杂度O(n)
    // let cache = new Set()
    // while(head) {
    //     if (cache.has(head)) {
    //         return true
    //     } else {
    //         cache.add(head)
    //     }
    //     head = head.next
    // }
    // return false
    // 使用快慢指针表，时间复杂度O(n)，空间复杂度O(1)
    let slow = head
    let fast = head
    while(fast && fast.next) {
        fast = fast.next.next
        slow = slow.next
        if (slow === fast) {
            return true
        }
    }
    return false
};
```

#### [链表中环的入口节点](#https://leetcode-cn.com/problems/linked-list-cycle-ii/)
快慢指针
```javascript
// https://leetcode-cn.com/problems/linked-list-cycle-ii/solution/linked-list-cycle-ii-kuai-man-zhi-zhen-shuang-zhi-/
var detectCycle = function(head) {
    // const set = new Set()
    // let res = null
    // while(head) {
    //     if(set.has(head)) return head
    //     set.add(head)
    //     head = head.next
    // }
    // return res
    if (head === null) {
        return null;
    }
    let slow = head, fast = head;
    while (fast !== null) {
        slow = slow.next;
        if (fast.next !== null) {
            fast = fast.next.next;
        } else {
            return null;
        }
        if (fast === slow) {
            let ptr = head;
            while (ptr !== slow) {
                ptr = ptr.next;
                slow = slow.next;
            }
            return ptr;
        }
    }
    return null;
};
```

### [链表的中间结点](https://leetcode-cn.com/problems/middle-of-the-linked-list/)
快慢指针
```javascript
var middleNode = function(head) {
    let slow = head
    let fast = head
    while(fast && fast.next) {
        slow = slow.next
        fast = fast.next.next
    }
    return slow
};
```
### [寻找链表的倒数第k个元素](https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)
快慢指针

让快指针先走 k 步，然后快慢指针开始同速前进。这样当快指针走到链表末尾 null 时，慢指针所在的位置就是倒数第 k 个链表节点
```javascript
var getKthFromEnd = function(head, k) {
    let slow = head
    let fast = head
    while(k > 0) {
        fast = fast.next
        k--
    }
    while(fast) {
        fast = fast.next
        slow = slow.next
    }
    return slow
};
```

### [k个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group)

````javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
    const stack = []
    let preHead = new ListNode(0)
    let pre = preHead
    // 循环链接后续反转链表
    while(true) {
        let count = 0
        let temp = head

        while(temp && count < k) {
            stack.push(temp)
            temp = temp.next
            count++
        }
        // 不够k个，直接链接剩下链表返回
        if(count !== k) {
            pre.next = head;
            break;
        }
        // 出栈即是反转
        while(stack.length > 0) {
            pre.next = stack.pop()
            pre = pre.next
        }

        head = temp
    }
    return preHead.next
};
````

#### [合并有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)
mine
```javascript
var mergeTwoLists = function(l1, l2) {
    let root = null
    let prev = null
    while(l1 || l2) {
        if(l1 && !l2) {
            if(prev) {
                prev.next = l1
                prev = prev.next
            } else {
                root = l1
                prev = root
            }
            break;
        } else if(!l1 && l2) {
            if(prev) {
                prev.next = l2
                prev = prev.next
            } else {
                root = l2
                prev = root
            }
            break;
        } else {
            if(l1.val > l2.val) {
                if(prev) {
                    prev.next = new ListNode(l2.val)
                    prev = prev.next
                } else {
                    root = new ListNode(l2.val)
                    prev = root
                }
                l2 = l2.next
            } else {
                if(prev) {
                    prev.next = new ListNode(l1.val)
                    prev = prev.next
                } else {
                    root = new ListNode(l1.val)
                    prev = root
                }
                l1 = l1.next
            }
        }
    }
    return root
};
```
递归
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
    if(l1 === null){
        return l2;
    }
    if(l2 === null){
        return l1;
    }
    if(l1.val < l2.val){
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    }else{
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}
```
迭代
```javascript
var mergeTwoLists = function(l1, l2) {
    const prehead = new ListNode(-1);

    let prev = prehead;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            prev.next = l1;
            l1 = l1.next;
        } else {
            prev.next = l2;
            l2 = l2.next;
        }
        prev = prev.next;
    }

    // 合并后 l1 和 l2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
    prev.next = l1 === null ? l2 : l1;

    return prehead.next;
};
```

#### [链表求和](https://leetcode-cn.com/problems/sum-lists-lcci/)

```javascript
var addTwoNumbers = function(h1, h2) {
    const res = new ListNode(Infinity)
    let curr = res
    let prevMoreVal = 0
    while(h1 && h2) {
        let val = h1.val + h2.val + prevMoreVal
        if (val > 9) {
            const str = String(val)
            prevMoreVal = parseInt(str.slice(0, 1))
            val = parseInt(str.slice(1,2))
        } else prevMoreVal = 0
        curr.next = new ListNode(val)
        curr = curr.next
        h1 = h1.next
        h2 = h2.next
    }
    if(h1) curr.next = h1
    else if (h2) curr.next = h2
    let prev = curr
    curr = curr.next
    while(curr) {
        let val = curr.val + prevMoreVal
        if(val > 9) {
            prevMoreVal = 1
            val = val - 10
        } else prevMoreVal = 0
        prev.next = new ListNode(val)
        prev = prev.next
        curr = curr.next
    }
    if(prevMoreVal > 0) {
        prev.next = new ListNode(prevMoreVal)
    }
    return res.next
};
```
数位是正向存放的
````javascript
function addInList( head1 ,  head2 ) {
    // write code here
    function reverNode(head) {
        let prev = null
        while(head) {
            const temp = head.next
            head.next = prev
            prev = head
            head = temp
        }
        return prev
    }
    let h1 = reverNode(head1)
    let h2 = reverNode(head2)
    const res = new ListNode(Infinity)
    let curr = res
    let prevMoreVal = 0
    while(h1 && h2) {
        let val = h1.val + h2.val + prevMoreVal
        if (val > 9) {
            const str = String(val)
            prevMoreVal = parseInt(str.slice(0, 1))
            val = parseInt(str.slice(1,2))
        } else prevMoreVal = 0
        curr.next = new ListNode(val)
        curr = curr.next
        h1 = h1.next
        h2 = h2.next
    }
    if(h1) curr.next = h1
    else if (h2) curr.next = h2
    let prev = curr
    curr = curr.next
    while(curr) {
        let val = curr.val + prevMoreVal
        if(val > 9) {
            prevMoreVal = 1
            val = val - 10
        } else prevMoreVal = 0
        prev.next = new ListNode(val)
        prev = prev.next
        curr = curr.next
    }
    if(prevMoreVal > 0) {
        prev.next = new ListNode(prevMoreVal)
    }
    return reverNode(res.next)
}
````
## 7.动态规划

### [凑零钱问题](https://leetcode-cn.com/problems/coin-change/)
```javascript
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

### [最长递增子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)
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

## 8.数组

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
    let sum = nums[0]
    let prevSum = nums[0]
    for(let i = 1; i < nums.length;i++) {
       prevSum = Math.max(nums[i], prevSum + nums[i])
       sum = Math.max(prevSum, sum)
    }
    return sum
};
```

### [合并两个有序数组](https://leetcode-cn.com/problems/sorted-merge-lcci/)
mine: 插入后交换
```javascript
/**
 * @param {number[]} A
 * @param {number} m
 * @param {number[]} B
 * @param {number} n
 * @return {void} Do not return anything, modify A in-place instead.
 */
var merge = function(A, m, B, n) {
    for(let i = 0; i < n; i++) {
        let b = B[i]
        if(A[m - 1 + i] <= b || m === 0) A[m+i] = b
        else {
            let swapFlag = false
            let lastV = 0
            for(let j = 0; j < m + i + 1; j++) {
                if(swapFlag) {
                    let temp = A[j]
                    A[j] = lastV
                    lastV = temp
                } else {
                    if(A[j] > b && !swapFlag) {
                        swapFlag = true
                        lastV = A[j]
                        A[j] = b
                    }
                }
            }
        }
    }
};
```
把 A 和 B 中的所有元素，从大到小依次放入 A 中
```javascript
var merge = function(A, m, B, n) {
    let index = m + n - 1, i = m - 1, j = n -1
    while(i > -1 || j > -1) {
        let a = i > -1 ? A[i] : -Infinity
        let b = j > -1 ? B[j] : -Infinity
        if(a > b) {
            A[index] = a
            i--
        } else {
            A[index] = b
            j--
        }
        index--
    }
};
```
### [全排列](https://leetcode-cn.com/problems/permutations/)
回溯算法
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

### [最长湍流子数组](https://leetcode-cn.com/problems/longest-turbulent-subarray/)

```javascript
/**
 * @param {number[]} arr
 * @return {number}
 */
var maxTurbulenceSize = function(arr) {
    if (arr.length === 1) return 1
    let max = 1
    for(let i = 0, p = 1,q = 1; i < arr.length-1; i++) {
        if (i%2 === 0) { // 偶数
            if(arr[i] < arr[i+1]) {
                p++
                max = Math.max(max, p, q)
                q = 1
            } else if (arr[i] > arr[i+1]) {
                q++
                max = Math.max(max, p, q)
                p = 1
            } else {
                max = Math.max(max, p, q)
                q = 1
                p = 1
            }
        } else{ // 基数
            if(arr[i] < arr[i+1]) {
                q++
                max = Math.max(max, p, q)
                p = 1
            } else if (arr[i] > arr[i+1]) {
                p++
                max = Math.max(max, p, q)
                q = 1
            } else {
                max = Math.max(max, p, q)
                q = 1
                p = 1
            }
        }
    }
    return max
};
```

### 9.二维数组
#### [N x N二维数组翻转90度](https://leetcode-cn.com/problems/rotate-image)
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

#### [二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/)
从左下角开始比较，对行列进行位移
```javascript
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
    if (matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }
    let row = matrix.length - 1
    let col = 0
    while(row >=0 && col <= matrix[0].length -1) {
        let val = matrix[row][col]
        if(target > val) {
            col++
        } else if(target < val) {
            row--
        } else {
            return true
        }
    }
    return false
};
```
### 二分查找

#### [二分查找](https://leetcode-cn.com/problems/binary-search/)

```javascript
function binarySearch(arr, target){
	let low = 0
	let high = arr.length - 1
	while (low <= high) {
		const mid = Math.floor((low + high)/2)
		const midValue = arr[mid]
		if (midValue > target) {
			high = mid - 1
		} else if (midValue < target) {
			low = mid + 1
		} else {
			return mid
		}
	}
	return -1
}
```

#### [扑克牌中的顺子](https://leetcode-cn.com/problems/bu-ke-pai-zhong-de-shun-zi-lcof/)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isStraight = function(nums) {
    //从小到大排序
    const minSort = nums.sort((a,b)=> a-b);
    //记录每个数字之间大差值，反正不能大于4
    let sum = 0;
    //不能超过4
    for(let i = 0; i<4;i++){
        //忽略0也就是王
        if(minSort[i] == 0){
            continue
        }
        //如果扑克牌（非0）重复，说明不是顺子
        else if(nums[i] == nums[i+1]){
            return false
        }else{
            //差值记录
            sum = sum + nums[i+1] - nums[i]
        }
    }
    //如果超过4，说明不是顺子。
    return sum<5
};
```

#### [扁平化嵌套列表迭代器](https://leetcode-cn.com/problems/flatten-nested-list-iterator/)

```javascript
/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function(nestedList) {
    // 通过生成器函数递归遍历嵌套数组
    var generator = function * (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].isInteger()) {
                yield arr[i].getInteger()
            } else {
                yield* generator(arr[i].getList())
            }
        }
    };

    // 初始化迭代器
    this.iterator = generator(nestedList);
    // 调用迭代器的 next 方法，返回 {value: val, done: true/false}，value 为返回的值，done 表示是否遍历完
    this.nextVal = this.iterator.next();
};


/**
 * @this NestedIterator
 * @returns {boolean}
 */
NestedIterator.prototype.hasNext = function() {
    return !this.nextVal.done;
};


/**
 * @this NestedIterator
 * @returns {integer}
 */
NestedIterator.prototype.next = function() {
    var value = this.nextVal.value;
    // 调用迭代器的 next 方法，更新 nextVal 的值
    this.nextVal = this.iterator.next();
    return value;
};
/**
 * Your NestedIterator will be called like this:
 * var i = new NestedIterator(nestedList), a = [];
 * while (i.hasNext()) a.push(i.next());
*/
```
