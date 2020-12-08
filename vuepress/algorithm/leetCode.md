---
title: LeetCode
---

## 目录
- [1.两数之和](#_1-两数之和)
- [2.回文数](#_2-回文数)
- [3.字符串](#_3-字符串)
  - [最长不含重复字符的子字符串](#最长不含重复字符的子字符串)

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

#### [最长不含重复字符的子字符串](https://leetcode-cn.com/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof/)
