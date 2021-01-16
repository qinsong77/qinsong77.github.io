---
title: 面试记录
---

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

```typescript
import React, { useState, useEffect } from 'react';

// 组件属性定义（可以自行扩展）:
interface InputProps {
	// 当前的 value 值
	value: string;
	// 初始化的 value 值
	defaultValue?: string;
	// 发生改变的时候触发的回调
	onChange?: (value: string) => any;
	// 最大长度
	maxLength?: number;
}

// 请实现 (class 方式 和 hook 方式二选一)
// 组件样式可以略过，但是要有合理的 DOM 结构

function customInput(props: InputProps) {
	const [value, setValue] = useState(props.value ? props.value : '')
	useEffect(() => {
		props.onChange ? props.onChange(value) : ''
	}, [value])
	return (
		<div class='custom-input'>
			<input value={ value } type="text" onchange={ (e) => setValue(e.target.value)}/>
            <span class='custom-input-shuffix'>{ value.length + '/' + props.maxLength }</span>
		</div>
	)
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
