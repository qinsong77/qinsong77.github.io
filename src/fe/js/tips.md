
1. 清除数组的最好办法
```js
// from https://zh.javascript.info/array
arr.length = 0
```
2. `Number`
```
Number('') = 0
Number(null) = 0 
Number(undefined) = NAN 
Number(false) = 0 
Number(true) = 1
```
字符串截取使用`slice(start,end)` from start to end (not including end)


