---
title: React
---
[react](https://zh-hans.reactjs.org/)

[React技术揭秘](https://react.iamkasong.com/)

[React 是如何工作的](https://mp.weixin.qq.com/s/ifLP36rFhYJsU2RCAi7OZQ)

[图解React](http://www.7km.top/)

[react+typescript](https://github.com/typescript-cheatsheets/react)

[2021年React学习路线图](https://mp.weixin.qq.com/s?__biz=MzUxMzcxMzE5Ng==&mid=2247505750&idx=2&sn=a31164ddf69f49e3761d2a6d660cf316&chksm=f9526215ce25eb031cbb1f8e0137b3fb3e30f6305fb183f028ab12419699695173b51c44b49d&scene=132#wechat_redirect)

[Build your own React](https://pomb.us/build-your-own-react/)

`npx create-react-app my-app --typescript` => `--typescript`被弃用，使用`--template typescript`


## 概述

React用于构建用户界面的 JavaScript 库

单项数据流：
把组件相当于一个函数，props 相当于函数的传参。如果组件内部可以改变 props 就相当于，在函数内部改变参数。那么这个函数就产生了副作用，那么这个函数就不是一个 `pure function`。这会使函数变的不可测试，不可测试也就不能预测执行结果，从而降低代码可维护性。

React采用自上而下单向数据流的方式，管理自身的数据与状态。在单向数据流中，数据只能由父组件触发，向下传递到子组件。

可以在父组件中定义state，并通过props的方式传递到子组件。如果子组件想要修改父组件传递而来的状态，则**只能给父组件发送消息，由父组件改变，再重新传递给子组件**。

在React中，**state与props的改变，都会引发组件重新渲染。如果是父组件的变化，则父组件下所有子组件都会重新渲染**。

在class组件中，组件重新渲染，是执行render方法。

**而在函数式组件中，是整个函数重新执行。**

### [React16的组件类型](https://zhuanlan.zhihu.com/p/55000793)

### 函数式组件

函数式组件与普通的函数几乎完全一样。只不过函数执行完毕时，返回的是一个JSX结构。

```jsx harmony
function Hello() {
  return <div>hello world.</div>
}
```

- **1. 函数式组件接收props作为自己的参数**

```typescript jsx

import React from 'react';

interface Props {
  name: string,
  age: number
}

function Demo({ name, age }: Props) {
  return [
    <div>name: {name}</div>,
    <div>age: {age}</div>
  ]
}

export default Demo;
```

- 2. **props的每次变动，组件都会重新渲染一次，函数重新执行。**

- 3. **没有this。那么也就意味着，之前在class中由于this带来的困扰就自然消失了。**

[React是怎么分辨class或者function 组件的](https://juejin.cn/post/6844903735412391944): 

```jsx harmony
// 类组件
class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}
// 函数式组件
function Greeting() {
  return <p>Hello</p>;
}
// 调用
// Class or function — whatever.
<Greeting />
// 但在react内部
// Inside React
const result = Greeting(props); // <p>Hello</p>
// Inside React
const instance = new Greeting(props); // Greeting {}
const result = instance.render(); // <p>Hello</p>
```
**函数组件之间运行，而类组件需要`new`实例化**， 所以函数组件没有`this`，应用是独立调用的，而`new`会强制绑定`this`

实际上React对基础的组件也就是**`React.Component`添加了一个标记**，并通过这个标记来区分一个组件是否是一个类组件。

```js
// Inside React
class Component {}
Component.prototype.isReactComponent = {};

// We can check it like this
class Greeting extends Component {}
console.log(Greeting.prototype.isReactComponent); // ✅ Yes
```

#### JSX简介

[React 是如何创建 vdom 和 fiber tree](https://mp.weixin.qq.com/s?__biz=MzI3ODU4MzQ1MA==&mid=2247484766&idx=1&sn=a4f15894db4076c43a7859a5bc77542f&chksm=eb5584abdc220dbd222c5eeb239e0db1cff1385a89381da651476a7730f455f43c9c8d465478&mpshare=1&scene=23&srcid=0205epPsZMYOfNhALNtvAldy&sharer_sharetime=1612515049758&sharer_shareid=1958dfa2b35b63c7a7463d11712f39df#rd)

JSX在编译时会被`Babel`编译为`React.createElement`方法。

`React.createElement`最终会调用`ReactElement`方法返回一个包含组件数据的对象，该对象有个参数`$$typeof: REACT_ELEMENT_TYPE`标记了该对象是个`React Element`。

```js
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 将 config 处理后赋值给 props
    // ...省略
  }

  const childrenLength = arguments.length - 2;
  // 处理 children，会被赋值给props.children
  // ...省略

  // 处理 defaultProps
  // ...省略

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```

React提供了验证合法React Element的全局API`React.isValidElement`

```js
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```
可以看到，`$$typeof === REACT_ELEMENT_TYPE`的非null对象就是一个合法的`React Element`。换言之，在React中，所有JSX在运行时的返回结果（即`React.createElement()`的返回值）都是`React Element`。


## [生命周期](https://zh-hans.reactjs.org/docs/react-component.html)

## React16.3.0之前生命周期:

[文章](https://juejin.cn/post/6844904021233238024)

![](./image/react-lifeCircle-old.png)

### 创建期:

- constructor(props, context)
- componentWillMount()
- render()
- componentDidMount()

### 运行时:

#### props发生变化时

- componentWillReceiveProps(nextProps, nextContext)
- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)
- render
- componentDidUpdate(prevProps, prevState, snapshot)

#### state发生变化时

- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)
- render
- componentDidUpdate(prevProps, prevState, snapshot)

### 卸载时

- componentWillUnmount()

## React16.3.0之后的生命周期

### 创建期:

- constructor(props, context)
- static getDerivedStateFromProps(props, status)
- render()
- componentDidMount()

或者如下生命周期:

- constructor(props, context)
- componentWillMount() / UNSAFE_componentWillMount()
- render()
- componentDidMount()
注意: `getDerivedStateFromProps`/`getSnapshotBeforeUpdate` 和 `componentWillMount`/`componentWillReceiveProps`/`componentWillUpdate` 如果同时存在，React会在控制台给出警告信息，且仅执行 getDerivedStateFromProps/getSnapshotBeforeUpdate 【React@16.7.0】

### 运行时:

#### props发生变化时

- static getDerivedStateFromProps(props, status)
- shouldComponentUpdate(nextProps, nextState, nextContext)
- render
- getSnapshotBeforeUpdate(prevProps, prevState)
- componentDidUpdate(prevProps, prevState, snapshot)

或者如下生命周期:

- componentWillReceiveProps(nextProps, nextContext)/UNSAFE_componentWillReceiveProps
- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)
- render
- componentDidUpdate(prevProps, prevState, snapshot)

#### state发生变化时

- static getDerivedStateFromProps(props, status)
- shouldComponentUpdate(nextProps, nextState, nextContext)
- render
- getSnapshotBeforeUpdate(prevProps, prevState)
- componentDidUpdate(prevProps, prevState, snapshot)
或者如下生命周期:

- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)/UNSAFE_componentWillUpdate
- render
- componentDidUpdate(prevProps, prevState, snapshot)
#### 销毁时

- componentWillUnmount()

[示意图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

新的生命周期图示:

![](./image/react-lifecircle1.png)

![](./image/react-lifecircle2.png)

### 受控与非受控组件

受控组件：在 HTML 中，表单元素（如`<input>、 <textarea>、<select>`)通常自己维护 state，并根据用户输入进行更新。
即如Input的value绑定了state,而onChange时使用setState更新。

也可以说是组件外部能控制组件内部的状态，则表示该组件为受控组件。

外部想要控制内部的组件，就必须要往组件内部传入props。而通常情况下，受控组件内部又自己有维护自己的状态。例如input组件。

如下实现


```typescript jsx
import React, {useState, useEffect} from 'react'

interface Props {
	value?: string,
	maxLength?: number
}

export default function App({value, maxLength}: Props) {
	const [state, setState] = useState('')
	useEffect(() => {
		value && setState(value) // 这里能通过props控制state
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

在大多数情况下，推荐使用 `受控组件` 来处理表单数据。

在一个受控组件中，表单数据是由 `React` 组件来管理的。另一种替代方案是使用非受控组件，这时表单数据将交**由 `DOM` 节点来处理**。

写一个非受控组件，而不是为每个状态更新都编写数据处理函数，使用 `ref` 来从 `DOM`节点中获取表单数据。

如input是file类型的，它的value是只取的，所以它是 React 中的一个非受控组件

```jsx harmony
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```


### [setState](https://zhuanlan.zhihu.com/p/39512941)

- setState 只在合成事件和钩子函数中是“异步”的，在原生事件和setTimeout 中都是同步的。
- setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。
- setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时setState多个不同的值，在更新时会对其进行合并批量更新。

### React.PureComponent与React.memo()

一个组件重新重新渲染，一般三种情况：

1. 要么是组件自己的状态改变
2. 要么是父组件重新渲染，导致子组件重新渲染，但是父组件的 props 没有改版
3. 要么是父组件重新渲染，导致子组件重新渲染，但是父组件传递的 props 改变


React.PureComponent 中以浅层对比 prop 和 state 的方式来实现`shouldComponentUpdate(nextProps, nextState)`。仅作对象的浅层比较。如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果。

其实就是默认实现了`shouldComponentUpdate`，可以判断是否重新渲染。而memo是对函数式组件的高阶运用。

`React.memo` 仅检查 `props` 变更。如果函数组件被` React.memo `包裹，且其实现中拥有 `useState `或 `useContext` 的 Hook，当 context 发生变化时，它仍会重新渲染。
默认情况下其只会对复杂对象做浅层对比，如果想要控制对比过程，那么可以将自定义的比较函数通过第二个参数传入来实现。
```jsx harmony
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```
```jsx harmony
class Child extends React.PureComponent {
	// shouldComponentUpdate(nextProps, nextState, nextContext) {
	// 	return nextProps.seconds !== this.props.seconds
	// }
	
	render(){
		console.log('I am rendering');
		return (
			<div>I am update every {this.props.seconds} seconds</div>
		)
	}
}
```



### 高阶组件

好文章-[React新特性Hooks使用教学，以及与高阶组件、renderProps模式的对比](https://blog.csdn.net/qq_40962320/article/details/87043581)

高阶组件是参数为组件，返回值为新组件的函数。组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

HOC 是纯函数，没有副作用。

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```
example：

```jsx harmony

const withMouse = (Component) => {
  return class extends React.Component {
    state = { x: 0, y: 0 }

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }

    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <Component {...this.props} {...this.state} />
        </div>
      )
    }
  }
}
```
使用
```jsx harmony
const App2= withMouse(({ x, y }) => {
  return (
    <div style={{ height: '100%' }}>
      <div>x: {position.x}, y: {position.y}</div>
    </div>
  )
})
```

问题: 

- 嵌套地狱，每一次HOC调用都会产生一个组件实例
- 可以使用类装饰器缓解组件嵌套带来的可维护性问题(链式调用的时候嵌套太多)，但装饰器本质上还是HOC
- 包裹太多层级之后，可能会带来props属性的覆盖问题

当嵌套使用多个高阶组件时，在代码中无法识别props中的参数，是哪里来的。并且当参数命名重复时一样无法解决。因此高阶组件在使用时会非常小心，以至于在很多场景下，我们放弃共同逻辑片段的封装，因为这会很容易造成滥用。


example
````jsx harmony
import React from 'react'
import { Button } from 'antd'
import GetRandomColor from './util'

// 属性被写死了。如果子组件需求的属性名写得不一样，高阶组件就无能为力了 =》可以用es6解构重命名解决的样子
function Count({ count: newCount, add, minus, theme, changeTheme }) {
    return (
        <div
            style={{
                backgroundColor: theme,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10
            }}
        >
            <p>You clicked {newCount} times</p>
            <Button onClick={add}>add</Button>
            <Button onClick={minus}>minus</Button>
            <Button onClick={changeTheme}>changeTheme</Button>
        </div>
    )
}

const countNumber = (initNumber) => (WrappedComponent) =>
    class CountNumber extends React.Component {
        state = { count: initNumber }

        // eslint-disable-next-line no-invalid-this
        add = () => this.setState({ count: this.state.count + 1 })

        // eslint-disable-next-line no-invalid-this
        minus = () => this.setState({ count: this.state.count - 1 })

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    count={this.state.count}
                    add={this.add}
                    minus={this.minus}
                />
            )
        }
    }

const changeTheme = (initColor) => (WrappedComponent) => {
    class ChangeTheme extends React.Component {
        state = {
            theme: initColor
        }
        changeTheme = () => this.setState({ theme: GetRandomColor() })

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    theme={this.state.theme}
                    changeTheme={this.changeTheme.bind(this)}
                />
            )
        }
    }
    
    // 高阶组件会创造一个新的组件，当程序报错的时候，出现在异常信息里的会是这个新创建的组件而不是原本的无状态组件——想想在几十个地方都调用了这个高阶组件的时候，该如何知道错误在哪里？
       
   //解决这个问题的方法是给高阶组件设置displayName
    ChangeTheme.displayName = `changeTheme(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`
    return ChangeTheme
}

export default changeTheme('white')(countNumber(0)(Count)) // 链式调用
````


#### render props
具有 `render prop` 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。

其实就是`props`设置一个属性是函数，这个函数是个函数子组件，调用时把定义的组件的`state`，通过props传参给这个函数子组件，所以不一定没要取名为`render props`
```typescript jsx
import React from 'react'

interface Props {
    render: (props: { x: number, y: number }) => React.ReactNode
}

class Mouse extends React.Component<Props>{
    state = {
        x: 0,
        y: 0
    }

    handleMouseMove = (event: React.MouseEvent<HTMLDivElement, any>) => {
        this.setState({
            x: event.clientX,
            y: event.clientY
        })
    }

    render() {
        return (
            <div onMouseMove={this.handleMouseMove} className='mouse-move-container'>
                {this.props.render(this.state)}
            </div>
        )
    }
}
// 使用
export default function () {
    return (
        <Mouse render={
            ({x, y}) => (
                <div>x: {x}, y: {y}</div>
            )
        }/>
    )
}
```

相对高阶组件的优点：
- 不用担心props的命名冲突的问题
- 可以溯源，子组件的props一定来自父组件。
- 是动态构建的，页面在渲染后，可以动态地决定渲染哪个组件。
- 所有能用HOC完成的事情，Render Props都可以做，且更加灵活。
- 除了功能复用，还可以用作两个组件的单向数据传递。

`render props`解决了来源问题，同时也避免了命名冲突。

- 数据流向更直观了，子孙组件可以很明确地看到数据来源
- 但本质上`Render Props`是基于闭包实现的(传入的props是父组件的state)，大量地用于组件的复用将不可避免地引入了`callback hell`问题
- ender比高阶组件更为强大，但是也有一个小小的缺点，就是难以优化。因为组件内部是一个匿名函数，这就导致即便传入的属性没有任何变化，内部的子组件还是会整个渲染一遍。解决方法就是将该匿名函数再次包装，不过每次都这样做终究还是比较麻烦的。


问题

1. 可读性不高，直观上比较别扭。我们可以在Mouse组件中处理很多额外逻辑，甚至定义更多的交互样式。因此使用时会造成一些困扰。
2. 存在局限性。我们期望的是能够切割逻辑片段，render props最终仍然是组件化思维的扩展运用

example
```jsx harmony
import React from 'react'
import { Button } from 'antd'
import GetRandomColor from './util'

// call back hell
export default function Example() {
    return (
        <ChangeTheme
            initColor='white'
            render={({ theme, changeTheme }) => (
                <div
                    style={{
                        backgroundColor: theme,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10
                    }}
                >
                    <CountNumber initNumber={0}>
                        {({ count, add, minus }) => (
                            <>
                                <p>You clicked {count} times</p>
                                <Button onClick={add}>add</Button>
                                <Button onClick={minus}>minus</Button>
                                <Button onClick={changeTheme}>change Theme</Button>
                            </>
                        )}
                    </CountNumber>
                </div>
            )}
        >
            <p>this is props children content</p>
        </ChangeTheme>
    )
}

class CountNumber extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
    }
    // eslint-disable-next-line no-invalid-this
    state = { count: this.props.initNumber }
    // eslint-disable-next-line no-invalid-this
    add = () => this.setState({ count: this.state.count + 1 })
    // eslint-disable-next-line no-invalid-this
    minus = () => this.setState({ count: this.state.count - 1 })

    render() {
        return this.props.children({
            count: this.state.count,
            add: this.add,
            minus: this.minus
        })
    }
}

class ChangeTheme extends React.Component {
    state = {
        theme: this.props.initColor
    }
    changeTheme = () => {
        this.setState({
            theme: GetRandomColor()
        })
    }
    render() {
        return (
            <div>
                {this.props.children}
                <p>this is props render content</p>
                {this.props.render({
                    theme: this.state.theme,
                    changeTheme: this.changeTheme
                })}
            </div>
        )
    }
}
```

### 真实DOM操作和Virtual Dom

尤雨溪大佬知乎的回答

![](./image/domVsReact.png)

## Diff算法

如何将传统O(n^3)Diff算法的时间复杂度降为O(n)

原来的 O(n^3) 的 diff 流程是：

老树的每一个节点都去遍历新树的节点，直到找到新树对应的节点。那么这个流程就是 O(n^2)，再紧接着找到不同之后，再计算最短修改距离然后修改节点，这里是 O(n^3)

相关Leetcode题目[编辑距离](https://leetcode-cn.com/problems/edit-distance/)
```cvs
Diff算法 => O(n^3) => 将两个DOM树的所有节点两两对比，时间复杂度 O(n^2)
      prev                   last   

       A                         A
     /   \                     /   \
    D     B        =>         B     D
  /                                  \
 C                                    C

  所有节点两两相互对比：
  pA => lA
  pA => lB
  pA => lD
  pA => lC
  ...
  pC => lC

再进行树的编辑(插入、替换、删除)需要遍历一次，因此时间复杂度为 O(n^3)
```
React 在以下两个假设的基础之上提出了一套 O(n) 的启发式算法：
1. 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用他。
2. 两个不同类型的元素会产生出不同的树；
3. 开发者可以通过 `key prop` 来暗示哪些子元素在不同的渲染下能保持稳定；

O(n^3)=> O(n) => 简单粗暴，所有的节点按层级比较，只会遍历一次
```cvs
按叶子节点位置比较
 [0,0]           :  pA => lA      #相同，不理会
 [0.0,0.0]       :  pD => lB      #不同，删除pD，添加lB
 [0.1,0.1]      :  pB => lD      #不同，删除pB，添加lD
 [0.1.0,0.1.0]  :  pC => Null   #last树没有该节点，直接删除pC
 [0.1.2,0.1.2]  :  Null => lC    #prev树没有该节点，添加lC到该位置
```


概念

一个DOM节点在某一时刻最多会有4个节点和他相关。


1. `current Fiber`。如果该DOM节点已在页面中，`current Fiber`代表该DOM节点对应的Fiber节点。

2. `workInProgress Fiber`。如果该DOM节点将在本次更新中渲染到页面中，`workInProgress Fiber`代表该DOM节点对应的Fiber节点。

3. DOM节点本身。

4. JSX对象。即`ClassComponent`的`render`方法的返回结果，或`FunctionComponent`的调用结果。JSX对象中包含描述DOM节点的信息。

Diff算法的本质是对比1和4，生成2。

`Diff`的入口函数`reconcileChildFibers`出发，该函数会根据`newChild`（即JSX对象）类型调用不同的处理函数。
```flow js
// 根据newChild类型选择不同diff函数处理
// 这个函数不是递归的
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE或REACT_LAZY_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // // ...省略其他case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```
可以从同级的节点数量将Diff分为两类：

1. 当`newChild`类型为`object`、`number`、`string`，代表同级只有一个节点

2. 当`newChild`类型为`Array`，同级有多个节点

#### 单节点Diff

![](./image/oneNodeDiff.png)

第二步判断DOM节点是否可以复用

1. 先判断`key`是否相同（**props没有key值是`null`**，实验打印出Jsx中返回的React Element key是null）
2. 如果key相同则判断type是否相同，只有都相同时一个DOM节点才能复用。

#### 多节点diff

一共3中情况
1. 节点更新
2. 节点新增或减少
3. 节点位置变化

为什么没有想Vue一样使用双指针从数组头和尾同时遍历以提高效率

虽然本次更新的JSX对象 newChildren为数组形式，但是和newChildren中每个组件进行比较的是current fiber，**同级的Fiber节点是由sibling指针链接形成的单链表**，即不支持双指针遍历。

在日常开发中，相较于新增和删除，更新组件发生的频率更高。所以Diff会优先判断当前节点是否属于更新。

Diff算法的整体逻辑会经历两轮遍历：

第一轮遍历：处理更新的节点。

第二轮遍历：处理剩下的不属于更新的节点。
