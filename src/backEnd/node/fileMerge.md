---
title: 文件合并
---


#### 简单文件流

创建一个可读流和一个可写流，通过管道将可写流绑定到可读流，一个简单的 `Stream` 就完成了。

```javascript
const fs = require('fs');
const readStream = fs.createReadStream('./read.stream.txt');
const writeStream = fs.createWriteStream('./wirte.stream.txt');

readStream.pipe(writeStream);
```
管道 `pipe` 有两个参数：

- `destination` 是可写流对象，即数据写入的目标对象。
- `options`
  - `end` 读取结束时终止写入流，默认值是 `true`
所以默认情况下是不需要手动调用写入流 `end `方法。

#### 手动终止可写流

设置 `pipe` 配置 `end: false`，那可写流的状态会一直处于打开状态，这时候就要监听可读流 `end` 事件，待读取完成后调用可写流的 `end` 事件。如果可读流期间发生错误，也需要调用可写流的 `end` 事件，防止内存泄漏。

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('./read.stream.txt');
const writeStream = fs.createWriteStream('./wirte.stream.txt');

// 可写流处于打开状态，需手动关闭
readStream.pipe(writeStream, {
  end: false
});

// 监听可读流结束
readStream.on('end', () => {
  // console.log('可读流结束');
  writeStream.end('可写流结束');
});

// 监听错误
readStream.on('error', (err) => {
  console.log('error', err);
  writeStream.end('可写流结束')
});
```

### 合并多文件为一个文件
设置可写流一直处于打开状态，直到所有可读流读取结束或出现错误，才将可写流状态关闭掉。

```javascript
const fs = require('fs');
const path = require('path');

const resolve = dir => {
  return path.resolve(__dirname, dir);
}

/**
 * streamMerge 入口文件
 * @param { String } sourceDir 源文件目录名
 * @param { String } targetFile 目标文件
 */
function streamMerge (sourceDir, targetFile) {
  const fileReadStreams = fs.readdirSync(resolve(sourceDir)); // 获取源文件目录下的所有文件
  const fileWriteStream = fs.createWriteStream(resolve(targetFile)); // 创建一个可写流

  streamMergeRecursive(fileReadStreams, fileWriteStream);
}

/**
 * streamMergeRecursive  函数递归处理多文件合并
 * @param { Array } fileReadStreams 
 * @param { Stream } fileWriteStream
 */
function streamMergeRecursive (fileReadStreams = [], fileWriteStream) {
  // 递归到尾部情况判断
  if (!fileReadStreams.length) {
    return fileWriteStream.end('可读流合并完成'); // 关闭可写流，防止内存泄漏
  }

  const currentFile = resolve(`fileReadStreams/${fileReadStreams.shift()}`);
  const currentReadStream = fs.createReadStream(currentFile); // 获取当前的可读流
  currentReadStream.pipe(fileWriteStream, { end: false });
  currentReadStream.on('end', () => {
    streamMergeRecursive(fileReadStreams, fileWriteStream);
  });

  currentReadStream.on('error', (error) => {
    // 监听错误事件，关闭可写流，防止内存泄漏
    console.error(error);
    fileWriteStream.close();
  });
}

streamMerge('./fileReadStreams', './fileWriteStream.txt');
```
