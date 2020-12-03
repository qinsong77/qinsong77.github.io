---
title: 学习笔记
---

### 内置类型
JavaScript目前有八种内置类型（包含ES6的symbol）：
- null
- undefined
- string
- number
- boolean
- object
- symbol
- BigInt

#### typeof null 为 'object'的bug
> JavaScript中的数据在底层是以二进制存储，比如null所有存储值都是0，但是底层的判断机制，只要前三位为0，就会判定为object，所以才会有typeof null === 'object'这个bug。
#### instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上
语法
> object instanceof constructor

#### 使用Object.prototype.hasOwnProperty.call(obj, key) 比用obj.hasOwnProperty安全，因为非对象不会报错。

### JS中“假”值列表，即if不执行(if 等流控制语句会自动执行其他类型值到布尔值的转换即Boolean(null))
   - “”（空字符串）
   - 0、-0、NaN(无线数字)
   - null、undefined
   - false
   - 注意Infinity为真
### 语言中所有的底层存储方式是是什么。

- 数组(Array)
数组是一种聚合数据类型，它是将具有相同类型的若干变量有序地组织在一起的集合。数组可以说是最基本的数据结构，在各种编程语言中都有对应。一个数组可以分解为多个数组元素，按照数据元素的类型，数组可以分为整型数组、字符型数组、浮点型数组、指针数组和结构数组等。数组还可以有一维、二维以及多维等表现形式。

- 栈( Stack)
栈是一种特殊的线性表，它只能在一个表的一个固定端进行数据结点的插入和删除操作。栈按照后进先出的原则来存储数据，也就是说，先插入的数据将被压入栈底，最后插入的数据在栈顶，读出数据时，从栈顶开始逐个读出。栈在汇编语言程序中，经常用于重要数据的现场保护。栈中没有数据时，称为空栈。

- 队列(Queue)
队列和栈类似，也是一种特殊的线性表。和栈不同的是，队列只允许在表的一端进行插入操作，而在另一端进行删除操作。一般来说，进行插入操作的一端称为队尾，进行删除操作的一端称为队头。队列中没有元素时，称为空队列

- 链表( Linked List)
链表是一种数据元素按照链式存储结构进行存储的数据结构，这种存储结构具有在物理上存在非连续的特点。链表由一系列数据结点构成，每个数据结点包括数据域和指针域两部分。其中，指针域保存了数据结构中下一个元素存放的地址。链表结构中数据元素的逻辑顺序是通过链表中的指针链接次序来实现的。

- 树( Tree)
树是典型的非线性结构，它是包括，2个结点的有穷集合K。在树结构中，有且仅有一个根结点，该结点没有前驱结点。在树结构中的其他结点都有且仅有一个前驱结点，而且可以有两个后继结点，m≥0

- 图(Graph)
图是另一种非线性数据结构。在图结构中，数据结点一般称为顶点，而边是顶点的有序偶对。如果两个顶点之间存在一条边，那么就表示这两个顶点具有相邻关系

- 堆(Heap)
堆是一种特殊的树形数据结构，一般讨论的堆都是二叉堆。堆的特点是根结点的值是所有结点中最小的或者最大的，并且根结点的两个子树也是一个堆结构

- 散列表(Hash)
散列表源自于散列函数(Hash function)，其思想是如果在结构中存在关键字和T相等的记录，那么必定在F(T)的存储位置可以找到该记录，这样就可以不用进行比较操作而直接取得所查记录

#### JavaScript使用的是 堆(Heap) 和 栈( Stack)
JavaScript基本类型数据都是直接按值存储在栈中的(Undefined、Null、不是new出来的布尔、数字和字符串)，每种类型的数据占用的内存空间的大小是确定的，并由系统自动分配和自动释放。这样带来的好处就是，内存可以及时得到回收，相对于堆来说 ，更加容易管理内存空间。

JavaScript引用类型数据被存储于堆中 (如对象、数组、函数等，它们是通过拷贝和new出来的）。其实，说存储于堆中，也不太准确，因为，引用类型的数据的地址指针是存储于栈中的，当我们想要访问引用类型的值的时候，需要先从栈中获得对象的地址指针，然后，在通过地址指针找到堆中的所需要的数据。


#### [set, map, weakMap, weakSet](https://juejin.im/post/6844904169417998349)





### 执行上下文
相关文章
- [JavaScript 执行机制 —— 变量提升](https://juejin.im/post/6844903958553559053)
- [[译]理解 JavaScript 中的执行上下文和执行栈](https://juejin.cn/post/6844903682283143181)

浏览器执行JS函数其实是分两个过程的。一个是创建阶段Creation Phase,一个是执行阶段Execution Phase。
当执行 JS 代码时，会产生三种执行上下文

- 全局执行上下文
- 函数执行上下文
- eval 执行上下文

每个执行上下文中都有三个重要的属性

- 变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
- 作用域链（JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- this

```javascript
var a = 10
function foo(i) {
  var b = 20
}
foo()
```

对于上述代码，执行栈中有两个上下文：全局上下文和函数 `foo` 上下文。

```javascript
stack = [
    globalContext,
    fooContext
]
```

对于全局上下文来说，VO 大概是这样的

```javascript
globalContext.VO === globe
globalContext.VO = {
    a: undefined,
	foo: <Function>,
}
```

对于函数 `foo` 来说，VO 不能访问，只能访问到活动对象（AO）

```javascript
fooContext.VO === foo.AO
fooContext.AO {
    i: undefined,
	b: undefined,
    arguments: <>
}
// arguments 是函数独有的对象(箭头函数没有)
// 该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素
// 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者
```

对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 `[[Scope]]` 属性查找上级变量

```javascript
fooContext.[[Scope]] = [
    globalContext.VO
]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VO
fooContext.Scope = [
    fooContext.VO,
    globalContext.VO
]
```

接下来让我们看一个老生常谈的例子，`var`

```javascript
b() // call b
console.log(a) // undefined

var a = 'Hello world'

function b() {
	console.log('call b')
}
```

想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段。第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```javascript
b() // call b second

function b() {
	console.log('call b fist')
}
function b() {
	console.log('call b second')
}
var b = 'Hello world'
```

`var` 会产生很多错误，所以在 ES6中引入了 `let`。`let` 不能在声明前使用，但是这并不是常说的 `let` 不会提升，`let` 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

对于非匿名的立即执行函数需要注意以下一点

```javascript
var foo = 1
(function foo() {
    foo = 10
    console.log(foo)
}()) // -> ƒ foo() { foo = 10 ; console.log(foo) }
```

因为当 JS 解释器在遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到 `foo`，但是这个值又是只读的，所以对它的赋值并不生效，所以打印的结果还是这个函数，并且外部的值也没有发生更改。

 ```javascript
specialObject = {};
  
Scope = specialObject + Scope;
  
foo = new FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}
  
delete Scope[0]; // remove specialObject from the front of scope chain
 ```

### [this的指向](https://juejin.im/post/6844903496253177863)
> 在 ES5 中，其实 this 的指向，始终坚持一个原理：this 永远指向最后调用它的那个对象。
#### 改变 this 的指向的方法
- 使用 ES6 的箭头函数
- 在函数内部使用 _this = this
- 使用 apply、call、bind
- new 实例化一个对象

```javascript
function foo() {
	console.log(this.a)
}
var a = 1
foo() // 1

var obj = {
	a: 2,
	foo: foo
}
obj.foo() // 2

// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo()
c.a = 3
console.log(c.a) // 3

function a() {
    return () => {
        return () => {
        	console.log(this)
        }
    }
}
console.log(a()()()) // windows
// 箭头函数其实是没有 this 的，这个函数中的 this 只取决于他外面的第一个不是箭头函数的函数的 this。在这个例子中，因为调用 a 符合前面代码中的第一个情况，所以 this 是 window。并且 this 一旦绑定了上下文，就不会被任何代码改变。
```

## 事件循环
### [JavaScript 执行机制](https://juejin.im/post/6844903512845860872)
- [文章1](https://xieyufei.com/2019/12/30/Quiz-Eventloop.html)
- [文章2](https://juejin.im/post/6844903971228745735)
- [文章3](https://juejin.im/post/6844903711106400264)
- [文章4](https://juejin.im/post/6844903752621637645)
- [mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

[浏览器与Node的事件循环(Event Loop)有何区别](https://juejin.im/post/6844903761949753352)
>JavaScript 是单线程、异步、非阻塞、解释型脚本语言。JS引擎会将JS脚本进行编译和执行
>JavaScript 的设计就是为了处理浏览器网页的交互（DOM操作的处理、UI动画等），决定了它是一门单线程语言。如果有多个线程，它们同时在操作 DOM，那网页将会一团糟。
>执行栈（先进后出，执行栈中存放正在执行的代码）和堆（堆中存放变量的值）
>JS执行栈和渲染线程是相互阻塞的
> 事件循环实现异步
>事件循环就是用来做调度的，浏览器和NodeJS中的事件循坏就好像操作系统的调度器一样。
### 事件循环的流程大致如下
-   1、所有任务都在主线程上执行，形成一个执行栈。
-   2、主线程发现有异步任务，就在“任务队列”之中加入一个任务事件。
-   3、一旦“执行栈”中的所有同步任务执行完毕，系统就会读取“任务队列”（先进先出原则）。那些对应的异步任务，结束等待状态，进入执行栈并开始执行。
-   4、主线程不断重复上面的第三步，这样的一个循环称为事件循环。

----
- 执行一个宏任务（栈中没有就从事件队列中获取）


- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中


- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）


- 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染


- 渲染完毕后，JS引擎线程继续，开始下一个宏任务（从宏任务队列中获取）
### 宏任务包括：
- script(整体代码)
- setTimeout, setInterval, setImmediate,
- I/O
- UI rendering
    　　
### 微任务包括：
    
- process.nextTick
- Promise
- MutationObserver(html5新特性)

>在node环境下，process.nextTick的优先级高于Promise，也就是说：在宏任务结束后会先执行微任务队列中的nextTickQueue，然后才会执行微任务中的Promise。

### [setInterval](http://caibaojian.com/setinterval.html),requestAnimationFrame代替绘制动画

```javascript
async function asyncA(){
	console.log('1')
	await asyncB()
	console.log('2')
}

async function asyncB(){
	console.log('3')
}

console.log('4')
setTimeout(() => {
	console.log('5')
	Promise.resolve().then(function(){
		console.log('6')
	})
}, 0)
setTimeout(() => {
	console.log('7')
	Promise.resolve().then(function(){
		console.log('8')
	})
}, 0)
asyncA()
new Promise(function(resolve){
	console.log('9')
	resolve()
}).then(function(){
	console.log('10')
})
console.log('11')
// 结果 4  1  3  9 11  2 10 5 6 7 8
```

#### Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的[`__proto__`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
```javascript
// 创建一个原型为null的空对象
const pureObj  = Object.create(null)
```

### [设计模式](https://juejin.im/post/6846687601785585677)

### [前端模块化](https://juejin.im/post/6844903744518389768)

[文章1](https://juejin.im/post/6844903576309858318)

[文章2](https://blog.csdn.net/leelxp/article/details/108101442)

 #### [ES6 模块与 CommonJS 模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)
 - CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
 - CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
 - CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。
 - CommonJS 模块处理循环加载的方法是返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。因为CommonJS 输入的是被输出值的拷贝，不是引用,只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
 >AMD(require.js) 推崇依赖前置、提前执行，CMD(sea.js)推崇依赖就近、延迟执行。
### JavaScript Number类型
 文章[JavaScript 深入之浮点数精度](https://github.com/mqyqingfeng/Blog/issues/155)

在 JavaScript 里面，数字均为双精度浮点类型（double-precision 64-bit binary format IEEE 754），即一个介于±2−1023和±2+1024之间的数字，或约为±10−308到±10+308，数字精度为53位。整数数值仅在±(253 - 1)的范围内可以表示准确。

除了能够表示浮点数，数字类型也还能表示三种符号值: +Infinity（正无穷）、-Infinity（负无穷）和 NaN (not-a-number，非数字)

#### 浮点数的组成
EEE 754 规定了包括：单精度（32位）、双精度（64位）、延伸单精度（43比特以上，很少使用）与延伸双精度（79比特以上，通常以80位实现）。而 JavaScript 使用的是双精度。

一个浮点数(value)可以这样表示：
![An image](./image/number/1.png)
也就是浮点数的实际值，等于符号位（sign bit）乘以指数偏移值(exponent bias)再乘以分数值(fraction)。

 64 位双精度浮点型具体的字节分配：
![An image](./image/number/2.png)
从上图中可以看到，从高到低，64位被分成3段，分别是:
 1. 符号位（sign），只占 1 位，0 表示+，1 表示-。
 2. 指数位（exponent），占 11 位(取值范围 `[0, 2048)`)，记为 e。
 3. 分数位（fraction），有效数字位，占 52 位。
 
 指数位有 11 位，取值范围是 0 到 2047。当指数位 e=0 或者 e=2017 时，根据有效数字位 f 是否为 0 ，具有不同的特殊含义，具体见下表：
 
 ![An image](./image/number/4.png)

对于常用的 normal number, 为了方便表示指数为负数的情况，所以，指数位数值大小做了一个 -1023 的偏移量。对于一个非 0 数字而言，,它的二进制的科学计数法里的第一位有效数字固定是 1。这样，一个双精度浮点型数字的值就是

 ![An image](./image/number/5.png)
 
对于 subnormal number,它可以用来表示更加接近于 0 的数，它特殊的地方是有效数字位的前面补充的是 0 而不是 1，且指数为偏移量是 -1022，所以值是：

 ![An image](./image/number/6.png)
 
  ![An image](./image/number/7.png)

双精度浮点数(double)转化为十进制的公式：

![An image](./image/number/3.png)

其中，b 为二进制小数的第 52 - i 位的值。e 需减去取值范围的中位数 1023。特别的，当 e 等于 0 且小数位均为 0 时，表示 0，当 e 全为 1 且小数位均为 0 时，表示无穷，如果 e 全为 1 且小数位不均为 0 ，那么这不是一个数（NaN）。

对于 0.1 来说，转成二进制小数为：

```javascript
0.1.toString(2)
// "0.0001100110011001100110011001100110011001100110011001101"
```
用科学计数法表示：`1.100110011001100110011001100110011001100110011001101 x 2^-4`，指数为 -4，因此 e 等于 1019，
转成 11 位二进制数 `01111111011`；尾数为 `1001100110011001100110011001100110011001100110011010`，末尾补齐 0 至 52 位数；正负号标志 s 显然是 0。最终 0.1 在内存中长这样 `0011111110111001100110011001100110011001100110011001100110011010`，图形化显示为：

![An image](./image/number/8.png)

小数位其实是 1001 无限循环，根据 IEEE754 的舍入标准 进行了舍入，导致结果会比 0.1 大那么一点点，之所以使用的时候没感觉出来，是因为打印结果的时候舍入了小数点后第 18 位的值。Number 对象里有 toPrecision 方法来指定精度

```javascript
0.1.toPrecistion(20);
// "0.10000000000000000555"
0.2.toPrecistion(20);
// "0.20000000000000001110"
0.3.toPrecistion(20);
// "0.29999999999999998890"
// https://blog.csdn.net/a76326791212/article/details/109125123
// https://juejin.im/post/6844903747345235982
// https://juejin.im/post/6844903859962249229
```
![An image](./image/number/9.png)

#### 解决方法
- 只需要展示的话，可以 toFixed 或者 toPrecision 选择自己需要的精度，然后再 parseFloat 转成浮点数。需要注意的是，这两个方法均不是四舍五入法，而是上面提过的 IEEE754舍入标准，舍入至最接近的值，如果有 2 个值一样接近，则取偶数值。
- 如需对数据进行运算，那么一种常用的方法就是，把小数转成整数再进行运算，只要运算过程涉及到的数字不大于 MAX_SAFE_INTEGER ，得到的结果就是“精确”的。
##### toFixed
toFixed有四舍五入，部分场景会出bug
```javascript
1.54.toFixed(1) // '1.5'
1.55.toFixed(1) // '1.6'
1.64.toFixed(1) // '1.6'
1.65.toFixed(1) // '1.6'
1.66.toFixed(1) // '1.7'
```

toFixed因为舍入的规则是银行家舍入法：四舍六入五考虑，五后非零就进一，五后为零看奇偶，五前为偶应舍去，五前为奇要进一

主要是小数实际储存的值和显示的值不同，比如1.65的实际值是1.649...所以toFixed(1)的结果是1.6


### 尾递归优化

ECMAScript 6 规范新增了一项内存管理优化机制，让 JavaScript 引擎在满足条件时可以重用栈帧。

其实就是在严格模式下，一个函数最后返回另一个函数的返回结果，少一次栈的叠加

```javascript
function outerFunction(){
	return innerFunction() // 尾调用
}

function fib(n){
	if (n < 2) {
		return n
	}
	return fib(n - 1) + fib(n - 2)
}

// 斐波纳契数列尾递归优化
// 基础框架
function fib(n){
	return fibImpl(0, 1, n)
}

// 执行递归
function fibImpl(a, b, n){
	if (n === 0) {
		return a
	}
	return fibImpl(b, a + b, n - 1)
}
```

尾调用优化的条件就是确定外部栈帧真的没有必要存在了。涉及的条件如下：
 - 代码在严格模式下执行；
 - 外部函数的返回值是对尾调用函数的调用；
 - 尾调用函数返回后不需要执行额外的逻辑；
 - 尾调用函数不是引用外部函数作用域中自由变量的闭包。

### 闭包
> 闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。

- [[译]发现 JavaScript 中闭包的强大威力](https://juejin.cn/post/6844903769646317576)
- [破解前端面试（80% 应聘者不及格系列）：从闭包说起](https://juejin.cn/post/6844903474212143117)

闭包的定义很简单：函数 A 返回了一个函数 B，并且函数 B 中使用了函数 A 的变量，函数 B 就被称为闭包。

```javascript
function A() {
  let a = 1
  function B() {
      console.log(a)
  }
  return B
}
```

你是否会疑惑，为什么函数 A 已经弹出调用栈了，为什么函数 B 还能引用到函数 A 中的变量。因为函数 A 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

经典面试题，循环中使用闭包解决 `var` 定义函数的问题

```javascript
for ( var i=1; i<=5; i++) {
	setTimeout( function timer() {
		console.log( i );
	}, i*1000 );
}
```

首先因为 `setTimeout` 是个异步函数，所有会先把循环全部执行完毕，这时候 `i` 就是 6 了，所以会输出一堆 6。

解决办法两种，第一种使用闭包

```javascript
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

第二种就是使用 `setTimeout `  的第三个参数

```javascript
for ( var i=1; i<=5; i++) {
	setTimeout( function timer(j) {
		console.log( j );
	}, i*1000, i);
}
```

第三种就是使用 `let` 定义  `i` 了

```javascript
for ( let i=1; i<=5; i++) {
	setTimeout( function timer() {
		console.log( i );
	}, i*1000 );
}
```

因为对于 `let` 来说，他会创建一个块级作用域，相当于

```js
{ // 形成块级作用域
  let i = 0
  {
    let ii = i
    setTimeout( function timer() {
        console.log( ii );
    }, i*1000 );
  }
  i++
  {
    let ii = i
  }
  i++
  {
    let ii = i
  }
}
```

### 数组

::: tip
注意： 除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具。

若需要提前终止循环，可以使用：

- 一个简单的 for 循环
- for...of / for...in 循环
- Array.prototype.every()
- Array.prototype.some()
- Array.prototype.find()
- Array.prototype.findIndex()
   
:::

如果数组在forEach迭代时被修改了，则其他元素会被跳过。

```javascript
var words = ['one', 'two', 'three', 'four'];
words.forEach(function(word) {
  console.log(word);
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four
```

####forEach 与async
 问题描述
 ```javascript
var getNumbers = () => {
  return Promise.resolve([1, 2, 3])
}
var multi = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (num) {
        resolve(num * num)
      } else {
        reject(new Error('num not specified'))
      }
    }, 1000)
  })
}
async function test () {
  var nums = await getNumbers()
  nums.forEach(async x => {
    var res = await multi(x)
    console.log(res)
  })
}
test()
```

代码执行的结果是：1 秒后，一次性输出1，4，9。

解决问题

方式一

可以改造一下 forEach，确保每一个异步的回调执行完成后，才执行下一个

```javascript
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
async function test () {
  var nums = await getNumbers()
  asyncForEach(nums, async x => {
    var res = await multi(x)
    console.log(res)
  })
}
```
方式二

使用 `for-of` 替代 `for-each`。

`for-of` 可以遍历各种集合对象的属性值，要求被遍历的对象需要实现迭代器 (iterator) 方法，例如` myObject[Symbol.iterator]()` 用于告知 JS 引擎如何遍历该对象。一个拥有 `[Symbol.iterator]() `方法的对象被认为是可遍历的。
```javascript
var zeroesForeverIterator = {
  [Symbol.iterator]: function () {
    return this;
  },
  next: function () {
    return {done: false, value: 0};
  }
};
```
如上就是一个最简单的迭代器对象；for-of 遍历对象时，先调用遍历对象的迭代器方法 `[Symbol.iterator]()`，该方法返回一个迭代器对象(迭代器对象中包含一个 next 方法)；然后调用该迭代器对象上的 next 方法。

每次调用 next 方法都返回一个对象，其中 done 和 value 属性用来表示遍历是否结束和当前遍历的属性值，当 done 的值为 true 时，遍历就停止了。

```javascript
async function test () {
  var nums = await getNumbers()
  for(let x of nums) {
    var res = await multi(x)
    console.log(res)
  }
}
```
文章[当 async/await 遇上 forEach](https://objcer.com/2017/10/12/async-await-with-forEach/)

##### for in 和for of
for in

- for ... in 循环返回的值都是返回的是所有能够通过对象访问的、可枚举的属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。
- 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等
- 某些情况下, for ... in 循环会以任意的顺序遍历键名

for of 特点
- for of 不同与 forEach, 它可以与 break、continue和return 配合使用,也就是说 for of 循环可以随时退出循环。
  
- 提供了遍历所有数据结构的统一接口

哪些数据结构部署了 Symbol.iterator属性了呢?只要有 iterator 接口的数据结构,都可以使用 for of循环。

- 数组 Array
- Map
- Set
- String
- arguments对象
- NodeList对象, 就是获取的dom列表集合
以上这些都可以直接使用 for of 循环。 凡是部署了 iterator 接口的数据结构也都可以使用数组的 扩展运算符(...)、和解构赋值等操作。
