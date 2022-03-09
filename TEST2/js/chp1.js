const a = 'a';
console.log(a.charCodeAt())

const str1 = 'abcd';

console.log(str1.slice(0, 2))
console.log(str1.substr(0,2))
console.log(str1.substring(0,2))
console.log(Number(''))
console.log(Number('123.1'))


const obj1= {};
const sy1 = Symbol('sy1');
const sy2 = Symbol('sy2');
obj1[sy1] = '1';
obj1[sy2] = '2';
obj1.name = 'obj1';
console.log(Object.keys(obj1));
for(let k in obj1) {
  console.log(k)
}

console.log(Object.getOwnPropertySymbols(obj1));


console.log(new Set([+0, -0, 0, NaN, NaN]))


const set1 = new Set([2,3,7,5]);
const set2 = new Set([3,8,9,7]);

const intersect = new Set([...set1].filter((v) => set2.has(v)))
console.log(intersect);
console.log(new Set([...set1, ...set2]))
//map.js
// function usageSize() {
//   const used = process.memoryUsage().heapUsed;
//   return Math.round((used / 1024 / 1024) * 100) / 100 + "M";
// }
//
// global.gc();
// console.log(usageSize()); // ≈ 3.19M
//
// let arr = new Array(10 * 1024 * 1024);
// const map = new Map();
//
// map.set(arr, 1);
// global.gc();
// console.log(usageSize()); // ≈ 83.19M
//
// arr = null;
// global.gc();
// console.log(usageSize()); // ≈ 83.2M


// for (var i = 0; i < 5; i++) {
//   setTimeout(function (j) {
//     console.log(j)
//   }, i*1000, i)
// }


for (let [index, ele] of ['a', 'b'].entries()) {
  console.log(index);
  console.log(ele);
}


const generateObj1 = {
  * [Symbol.iterator]() {
    yield 'hello'
    yield 'world'
  }
}

console.log([...generateObj1])

function red(){
  console.log('red');
}
function green(){
  console.log('green');
}
function yellow(){
  console.log('yellow');
}

//
// function createTask(timer, cb) {
//   return new Promise((resolve => {
//     setTimeout(() => {
//       cb()
//       resolve()
//     }, timer)
//   }))
// }
//
//
// function loopTask() {
//   createTask(3000, red)
//     .then(() => createTask(1000, green))
//     .then(() => createTask(2000, yellow))
//     .then(() => loopTask())
// }
//
// loopTask();

for (let i = 9; i > 0; i--) {
  console.log(i)
}


function _instanceOf (instance, fun) {
  if (typeof instance !== 'object' || instance === null) return false;
  let proto = instance.__proto__
  console.log(proto === Object.getPrototypeOf(instance))
  if (typeof fun !== "function") return false
  while (true) {
    if (proto === null) return false
    if (proto === fun.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

_instanceOf({te: '123'}, Array)


const readFileThunk = (filename) => {
  return (cb) => {
    fs.readFile(filename, cb)
  }
}
