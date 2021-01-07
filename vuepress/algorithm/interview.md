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

## 熙牛医疗

### 1、树形结构数据打印

```typescript
interface TreeNode extends Record<string, any> {
	id: number;
	parentId: number;
	name: string;
	Children?: TreeNode [];
}

function printTree(list: TreeNode[]): void {
	// 请实现此方法
	let result:TreeNode [] = []
	let addNodeSet = new Set()
	list.forEach(node => {
		const { id, parentId } = node
		if (!addNodeSet.has(id)) {
			// 找到父节点
			const parent = list.find(v => v.id === parentId)
			if (parent) {
				if (addNodeSet.has(parent.id)) { // 如果已经添加了父节点
					// 这里需要递归操作，找出父节点
					const findResultParent:(arr: TreeNode[], id: number) => TreeNode  = function (arr: TreeNode[], id: number) {
						let reNode: TreeNode
						for (let i = 0; i < arr.length; i++) {
							if (arr[i].id === id) {
								reNode = arr[i]
								break
							} else {
								let re = findResultParent(arr[i].Children, id)
								if (re) {
									reNode = re
									return reNode
								}
							}
						}
						return reNode
					}
					
					const parentNode = findResultParent(result, parent.id)
					if (!parentNode.Children) {
						parentNode.Children = []
					}
					parentNode.Children.push(Object.assign({Children: []}, node))
					addNodeSet.add(id)
				} else {
					addNodeSet.add(parent.id)
					addNodeSet.add(id)
					result.push(Object.assign({Children: [node]}, node))
				}
			} else {
				addNodeSet.add(id)
				result.push(Object.assign({Children: []}, node))
			}
		}
	})
	
	const print :(arr: TreeNode[], space: number) => void = function(arr: TreeNode[], space: number = 0) {
		arr.forEach(node => {
			console.log('  '.repeat(space) + node.name + ' \n ')
			if (node.Children) {
				print(node.Children, space + 2)
			}
		})
	}
	print(result, 0)
}

//============= 测试代码 ==============
const list: TreeNode[] = [
	{ id: 1001, parentId: 0, name: 'AA' },
	{ id: 1002, parentId: 1001, name: 'BB' },
	{ id: 1003, parentId: 1001, name: 'CC' },
	{ id: 1004, parentId: 1003, name: 'DD' },
	{ id: 1005, parentId: 1003, name: 'EE' },
	{ id: 1006, parentId: 1002, name: 'FF' },
	{ id: 1007, parentId: 1002, name: 'GG' },
	{ id: 1008, parentId: 1004, name: 'HH' },
	{ id: 1009, parentId: 1005, name: 'II' },
];

printTree(list);
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