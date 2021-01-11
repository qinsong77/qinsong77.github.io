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
- [4.二维数组翻转90度](#_4-二维数组翻转90度)

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
    
#### [4.二维数组翻转90度](https://leetcode-cn.com/problems/rotate-image)
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
由于矩阵中的行列从 00 开始计数，因此对于矩阵中的元素 `matrix[row][col]`，在旋转后，它的新位置为 `[col][n−row−1]`。

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
```
