function instanceOf(instance, classFun) {
  if (typeof instance !== 'object' || instance === null) return false;
  let proto = Object.getPrototypeOf(instance);
  const prototype = classFun.prototype;
  while (true) {
    if (proto === null) return false
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}


function myNew () {
  console.log(typeof arguments)
  console.log(arguments)
  const obj = {};
  const constructor = Array.prototype.shift.call(arguments);
  console.log(typeof arguments)
  console.log(arguments)
  if (!constructor.prototype) throw new Error('error')
  Object.setPrototypeOf(obj, constructor.prototype);
  const result = constructor.apply(obj, arguments)

  const isObject = typeof result === 'object' && result !== null
  const isFunction = typeof result === 'function'
  if(isObject || isFunction) {
    return result
  }

  // 原构造函数没有Object类型的返回值，返回我们的新对象
  return obj;
}

function Point(x, y) {
  this.x = x
  this.y = y
}
const point = myNew(Point, 1, 2)
console.log(point)


Function.prototype.myApply = function (context, args) {
  const fn = this;
  if (typeof fn !== 'function') throw new TypeError('');
  context = context || window;
  let result = null;
  const sy = Symbol();
  context[sy] = fn;
  result =   Array.isArray(args) ? context[fn](...args) : context[fn]()
  delete context[sy]
  return result;
}


Function.prototype.myBind = function (context) {
  const self = this;
  function
  Noop() {}
  const args1 = Array.prototype.slice.call(arguments, 1);

  const fun = function () {
    const arg2 = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof  noop ? this : context, args1.concat(arg2))
  }

  fun.prototype = new Noop();
  fun.prototype.constructor = fun

  return fun;
}


function curry(func) {
  return function curried(...args1) {
    if (args1.length >= func.length) return func.apply(this, args1);
    else return (...args2) => {
      return curried(...args1.concat(args2))
    }
  }
}



function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

console.log( curriedSum(1, 2, 3) ); // 6，仍然可以被正常调用
console.log( curriedSum(1)(2,3) ); // 6，对第一个参数的柯里化
console.log( curriedSum(1)(2)(3) ); // 6，全柯里化



function deepClone(data, hash = new WeakMap()) {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) return new Date(data)
  if (data instanceof RegExp) return new RegExp(data)
  if (typeof data !== 'object') return data;
  const cloneData = new data.constructor();
  hash.set(data, cloneData);
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      cloneData[k] = deepClone(data[k])
    }
  }
  return cloneData;
}

console.log(deepClone({arr: [12,1,2], te: new RegExp(/11/)}))



const objProxy  = {
  name: 'xx'
}


const loggerObj = new Proxy(objProxy, {
  get(target, p, receiver) {
    return Reflect.get(target, p, receiver)
  }
})



let arr = [1,21,3,34,1,21,3];

for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[j] === arr[i]) {
      arr.splice(j, 1)
      j--
    }
  }
}

console.log(arr);




let arr22 = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10
]


function flatten (arr) {
  return arr.reduce((prev, cur) => {
    return Array.isArray(cur) ? prev.concat(flatten(cur)) : prev.concat(cur)
  }, [])
}

console.log(flatten(arr22))




/**
new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 500);
    });
  })
  .then(console.log);



function Promise(ex) {
  this.status = 'PENDING';
  this.value = null;
  this.cbs = []
  const resolve = (value) => {
    this.status = 'FUILILED';
    this.value = value;
    this.cbs.forEach((fb) => fn(value))
  }
  ex(resolve)
}

Promise.prototype.then = function (onResolved) {
  return new Promise((resolved) => {
    this.cbs.push(() => {
      const value = onResolved(this.value)
      if (value instanceof Promise) {
        value.then(resolved)
      } else {
        resolved(value)
      }
    })
  })
}


Promise.finally((cb) => {
  return this.then((res) => Promise.resolve(cb()))
})
 **/


function mergeSort(arr) {
  if (arr.length > 1) {
    const middle = Math.floor(arr.length/2)
    const left = mergeSort(arr.slice(0, middle))
    const right = mergeSort(arr.slice(middle))
    arr = merge(left, right)
  }
  return arr;
}


function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i])
      i++
    } else {
      result.push(right[j])
      j++
    }
  }
  return result.concat(i < left.length ? left.slice(i) : right[j])
}

const arr21 =flatten(arr22)
console.log(arr21)
console.log(mergeSort(arr))
