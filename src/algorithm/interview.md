# 面试记录

 - [实现一个string的indexOf方法](#_1-一面实现一个string的indexof方法)
 - [树形结构数据打印](#_1、树形结构数据打印)
 - [React Input 表单组件](#_2、react-input-表单组件)
 - [JSON Key 驼峰转换](#_3、json-key-驼峰转换)
 - [因数分解-神策数据](#因数分解-神策数据)
 - [promise并发控制](#promise并发控制)
 - [promise串行控制](#promise串行控制)

## 美团

### 1. 一面实现一个string的indexOf方法

```javascript
// 自己思路的实现
function indexOf(a, b){
	let result = -1, flag = false, count = 0
	for (let i = 0; i < a.length; i++) {
		if (flag) {
			if (count === b.length) return i - count
			if (a[i] === b[count]) {
				count++
			} else {
				flag = false
				i = i - count + 1
				count = 0
			}
		} else {
			if (a[i] === b[count]) {
				flag = true
				count++
			} else {
				flag = false
				count = 0
			}
		}
	}
	return result
}

console.log(indexOf('0121abv1', 'abv') === '0121abv1'.indexOf('abv'))

String.prototype.myIndexOf = function(str){
	var sourceArr = this.split('')
	var num = -1
	for (var i in sourceArr) {
		if (sourceArr[i] === str.slice(0, 1)) {
			if (str === this.slice(i, Number(i) + str.length)) {
				num = i
			}
		}
	}
	return num
}
```
### promise的发布订阅

题目
```js
class PubSub {
  constructor() {
    // TODO
  }
  on (event, fn)  {
  }

  onOnce (event)  {
  }
  emit (event, data) {
  }
}

const pubsub = new PubSub()
// 订阅
pubsub.on('event', (data) => {
  console.log('event:' + JSON.stringify(data));
})
// 发布
pubsub.emit('event', { a: 1 });

// 异步订阅
const result = await pubsub.onOnce('event');
```


最重要的卡点就是`onOnce`是一个异步订阅，订阅之后要等该事件都执行完成才继续执行

```js
class PubSub {
  constructor() {
    this.cache = {}
  }
  on (event, fn)  {
    if (!this.cache[event]) {
      this.cache[event] = []
    }
    this.cache[event].push(fn);
  }

  onOnce (event)  {
    return new Promise((resolve,reject) => {
      this.on(event, () => resolve())
    })
  }
  emit (event, data) {
    const queue = this.cache[event];
    if (Array.isArray(queue)) {
      queue.forEach((task) => task(data))
    }
  }
}

const pubsub = new PubSub()
// 订阅
pubsub.on('event', (data) => {
  console.log('event:' + JSON.stringify(data));
})
// 发布
pubsub.emit('event', { a: 1 });

// 异步订阅
const result = await pubsub.onOnce('event');
```

## 熙牛医疗笔试题

### 1、树形结构数据打印

我的思路：利于对象引用关系

```javascript
const data = [
	{ id: 1001, parentId: 0, name: 'AA' },
	{ id: 1002, parentId: 1001, name: 'BB' },
	{ id: 1003, parentId: 1001, name: 'CC' },
	{ id: 1004, parentId: 1003, name: 'DD' },
	{ id: 1005, parentId: 1003, name: 'EE' },
	{ id: 1006, parentId: 1002, name: 'FF' },
	{ id: 1007, parentId: 1002, name: 'GG' },
	{ id: 1008, parentId: 1004, name: 'HH' },
	{ id: 1009, parentId: 1005, name: 'II' },
	{ id: 1011, parentId: 101, name: '444' },
	{ id: 10108, parentId: 10109, name: 'tt' },
	{ id: 10109, parentId: 10015, name: 'JJ' },
	{ id: 101, parentId: 10108, name: '333' },
];

function buildTree (data) {
	const result = []
	const dataMap = new Map()
	data.forEach(item => dataMap.set(item.id, item))
	data.forEach(item => {
		const { parentId } = item
		const parentNode = dataMap.get(parentId)
		if (parentNode) {
			parentNode.Children = parentNode.Children || []
			parentNode.Children.push(item)
		} else {
			result.push(item)
		}
	})
	return result
}

const print = (arr,space = 0) =>  {
	arr.forEach(node => {
		console.log('  '.repeat(space) + node.name + ' \n ')
		if (node.Children) {
			print(node.Children, space + 2)
		}
	})
}
print(buildTree(data), 0)
```
### 2、React Input 表单组件
类似于element的input组件，props可设置默认值，maxLength, 有`show-word-limit`的效果，组件支持受控和非受控模式

```typescript jsx
import React, {useState, useEffect} from 'react'

interface Props {
	value?: string,
	maxLength?: number
}

export default function App({value, maxLength}: Props) {
	const [state, setState] = useState('')
	useEffect(() => {
		value && setState(value)
	}, [value])
	function updateValue(inputValue: string) {
		if (maxLength !== undefined && inputValue.length > maxLength) return
		else setState(inputValue)
	}
	return (
		<div className='input-item'>
			<input value={state} onInput={(e => updateValue(e.currentTarget.value))} style={{ paddingRight: maxLength !== undefined ? '36px' : '10px'}}/>
			{ maxLength !== undefined &&
				<span>{ state.length + '/' + maxLength}</span>
			}
		</div>
	)
}
```

```css
.input-item {
  position: relative;
  display: inline-block;
}
.input-item input {
  color: rgba(0,0,0,.85);
  font-size: 14px;
  padding: 4px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
}
.input-item input:hover {
  border-color: #40a9ff;
}
.input-item input:focus {
  border-color: #40a9ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
}
.input-item span {
  font-size: 12px;
  color: rgba(0,0,0,.45);
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
 }
```

````jsx harmony
import React, {
    Component
} from 'react';


class App extends Component {
    static propTypes = {
        value: React.PropTypes.any
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: this.props.defaultValue || ''
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    get displayValue() {
        const key = 'value';
        const internalKey = 'value';

        return this.props[key] !== undefined ? this.props[key] : this.state[internalKey];
    }

    handleChange(newVal) {
        if (newVal === this.state.value) {
            return;
        }

        this.setState({
            value: newVal
        }, () => {
            this.props.onChange && this.props.onChange(newVal);
        });
    }

    componentWillReceiveProps(nextProps) {
        const controlledValue = nextProps.defaultValue;

        if (controlledValue !== undefined && controlledValue !== this.state.value) {
            this.setState({
                value: controlledValue
            }, () => {
                this.props.onChange && this.props.onChange(controlledValue);
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.value !== undefined) {
            // controlled, use `props.value`
            return nextProps.value !== this.props.value;
        }

        // uncontrolled, use `state.value`
        return nextState.value !== this.state.value;
    }

    mapPropToState(controlledValue) {
        // your can do some transformations from `props.value` to `state.value`
    }

    changeHandler(e) {
        const val = e.target.value;

        this.handleChange(val);
    }

    render() {
        return ( 
            <input 
                value = {this.displayValue} 
                onChange={this.changeHandler}
            />
        );
    }
}

export default App;
````
### 3、JSON Key 驼峰转换
```typescript
function convert(jsonObj: object | object[]) {
	// 请实现
	if (Array.isArray(jsonObj)) {
		jsonObj.forEach(item => {
			convert(item)
		})
	} else {
		const keys = Object.keys(jsonObj)
		keys.forEach(key => {
			const newKey = convertKey(key)
			jsonObj[newKey] = jsonObj[key]
			delete jsonObj[key]
			if (jsonObj[newKey] && typeof jsonObj[newKey] === 'object') {
				convert(jsonObj[newKey])
			}
		})
	}
	return jsonObj
}

function convertKey(str: string): string {
	let result: string = ''
	for (let i = 0; i < str.length; i++) {
		if (str[i] === '_' && str[i+1]) {
			result = result + str[++i].toUpperCase()
		} else {
			result = result + str[i]
		}
	}
	return result
}


// ------ 测试 ---------
console.log(convert({ 'a_bc_def': 1 }));
console.log(convert({ 'a_bc_def': { 'foo_bar': 2 } }));
console.log(convert({ 'a_bc_def': [{ 'foo_bar': 2 }, { 'goo_xyz': 3 }] }));

```
#### 因数分解(神策数据)
例子：24分解质因数为`2*2*2*3`，简写成(2^3) * (3^1)。
```javascript
// 判断是否为质数的方法(质数是一个大于1的自然数，除了1和它自身外，不能被其他自然数整除的数叫做质数。)
function isPrime(n) {
	for (let i = 2; i <= Math.sqrt(n); i++) {
		if (n % i === 0) {
			return false
		}
	}
	return true
}

function PrimeFactorizer(n) {
	//用来存储结果
	const result = []
	while (n > 1) {
		//从最小的质数开始除
		for (let i = 2; i <= n; i++) {
			if (isPrime(i) && n % i === 0) {
				result.push(i)
				//除掉这个最小的质数因子
				n /= i
			}
			
		}
	}
	//给实例上加个factor属性
	return result
	
}

console.log(PrimeFactorizer(24))
```
### promise并发控制
实现一个批量请求函数 multiRequest(urls, maxNum)，要求如下：
- 要求最大并发数 maxNum
- 每当有一个请求返回，就留下一个空位，可以增加新的请求
- 所有请求完成后，结果按照 urls 里面的顺序依次打出
```javascript
function multiRequest(urls = [], maxNum){
	// 请求总数量
	const len = urls.length
	// 根据请求数量创建一个数组来保存请求的结果
	const result = new Array(len).fill(false)
	// 当前完成的数量
	let count = 0

	return new Promise((resolve, reject) => {
		// 请求maxNum个
		while (count < maxNum) {
			next()
		}

		function next(){
			let current = count++
			// 处理边界条件
			if (current >= len) {
				// 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
				!result.includes(false) && resolve(result)
				return
			}
			const url = urls[current]
			console.log(`开始 ${current}`, new Date().toLocaleString())
			fetch(url)
				.then((res) => {
					// 保存请求结果
					result[current] = res
					console.log(`完成 ${current}`, new Date().toLocaleString())
					// 请求没有全部完成, 就递归
					if (current < len) {
						next()
					}
				})
				.catch((err) => {
					console.log(`结束 ${current}`, new Date().toLocaleString())
					result[current] = err
					// 请求没有全部完成, 就递归
					if (current < len) {
						next()
					}
				})
		}
	})
}
```
#### 实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多 n 个。
```js
class Scheduler {
    constructor(count) {
        this.count = count
    }
    add(task) {}
    schedule() {}
}

// Usage
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output: 2 3 1 4
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4
```
```javascript
class Scheduler {
	constructor(count) {
		this.count = count
		this.runningCount = 0
		this.pendingTask= []
	}
	add(task) {
		return new Promise((resolve, reject) => {
			if (this.runningCount < this.count) {
				this.runningCount++
				task()
					.then(res => {
						resolve(res)
						this.runningCount--
						this.schedule()
					})
			} else {
				this.pendingTask.push({
					task,
					resolve,
					reject
				})
			}
		})
	}
	schedule() {
		if(this.pendingTask.length === 0) return
		const obj = this.pendingTask.shift()
		obj.task()
			.then(res => {
				obj.resolve(res)
				this.schedule()
			})
	}
}

// Usage
const timeout = (time) => new Promise(resolve => {
	setTimeout(resolve, time)
})
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
	scheduler.add(() => timeout(time))
		.then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
```
#### promise串行控制

>页面上有三个按钮，分别为 A、B、C，点击各个按钮都会发送异步请求且互不影响，每次请求回来的数据都为按钮的名字。 请实现当用户依次点击 A、B、C、A、C、B 的时候，最终获取的数据为 ABCACB。

这道题目主要两个考点：

1. 请求不能阻塞，但是输出可以阻塞。比如说 B 请求需要耗时 3 秒，其他请求耗时 1 秒，那么当用户点击 BAC 时，三个请求都应该发起，但是因为 B 请求回来的慢，所以得等着输出结果。
2. 如何实现一个队列？
我的实现
```javascript
const delay = (params) => {
	const time = Math.floor(Math.random() * 5)
	
	return new Promise((resolve => {
		setTimeout(() => {
			resolve(params)
		}, time * 500)
	}))
}

class Queue {
	constructor() {
		this.stack = []
	}
	execute (p) {
		return new Promise((resolve => {
			this.stack.push({
				resolve
			})
			p.then(res => {
				const index = this.stack.findIndex(v => v.resolve === resolve)
				this.stack[index].res = res
				for(let i = 0; i < this.stack.length; i++) {
					if(this.stack[i].res) {
						this.stack[i].resolve(this.stack[i].res)
					} else {
						break
					}
				}
			})
		}))
	}
}

const queue = new Queue()

const handleClick = async (name) => {
	const res = await queue.execute(delay(name))
	console.log(res)
}

handleClick('A');
handleClick('B');
handleClick('C');
handleClick('A');
handleClick('C');
handleClick('B');
```
其实队列可以直接借助`promise.then`实现

```javascript
class Queue {
	
	constructor() {
		this.promise = Promise.resolve();
	}
	execute(promise) {
		this.promise = this.promise.then(() => promise);
		return this.promise;
	}
}
```
**红绿灯问题**

题目：红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promise 实现）

三个亮灯函数已经存在：
```javascript
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}
```
  ::: details 点击查看代码
```javascript
function createTask(cb, time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            cb()
            resolve()
        }, time)
    })
}

function loopTask() {
    return createTask(red, 3000)
        .then(() => createTask(green, 1000))
        .then(() => createTask(yellow, 2000))
        .then(() => loopTask())
}
```
