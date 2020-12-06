console.log('__dirname:', __dirname); // 文件夹
console.log('__filename:', __filename); // 文件
console.log(require('os').homedir()) // HOME 目录
// console.log(process.env.PATH.split(':').join('\n'));

console.log(process.memoryUsage())

const path = require('path')

console.log(path.join(__dirname, 'dist'))
