# React Hooks

- [React Hooks 原理](https://github.com/brickspert/blog/issues/26)

- [React Hooks 导读](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI4NjE3MzQzNg==&action=getalbum&album_id=1490474787792617475&scene=173)

- [React Hooks 完全上手指南](https://zhuanlan.zhihu.com/p/92211533)

[//]: # '# 目录'
[//]: #
[//]: # '- [什么是 Hooks](#一、什么是-hooks)'
[//]: # '- [Hooks 解决的问题](#二、hooks-解决的问题)'
[//]: # '- [Hooks 优势](#hooks-优势)'
[//]: # '- [注意事项](#注意事项)'
[//]: # '- [React Hooks 能够让函数组件拥有内部状态的基本原理](#react-hooks能够让函数组件拥有内部状态的基本原理)'
[//]: # '- [useState](#usestate)'
[//]: # '- [useEffect](#useeffect)'
[//]: # '  - [useEffect 解决了哪些问题](#useeffect解决了哪些问题)'
[//]: # '  - [和 setInterval](#和setinterval)'
[//]: # '  - [useEffect 中不能使用 async function](#useeffect中不能使用async-function)'
[//]: # '- [useLayoutEffect](#uselayouteffect)'
[//]: # '- [自定义 Hooks](#自定义hooks)'
[//]: # '- [useReducer](#usereducer)'
[//]: # '- [useContext](#usecontext)'
[//]: # '- [useRef](#useref)'
[//]: # '  - [useImperativeHandle](#useimperativehandle)'
[//]: # '- [useMemo](#usememo)'
[//]: # '- [useCallback](#usecallback)'
[//]: # '- [优化总结](#优化总结)'
[//]: # '- [原理](#原理)'

## 一、什么是 Hooks

**有状态的函数式组件。**

- React 认为，UI 视图是数据的一种视觉映射，即`UI = F(DATA)`，这里的 F 需要负责对输入数据进行加工、并对数据的变更做出响应
- 公式里的`F`在 React 里抽象成组件，React 是以组件（Component-Based）为粒度编排应用的，组件是代码复用的最小单元
- 在设计上，React 采用 props 属性来接收外部的数据，使用 state 属性来管理组件自身产生的数据（状态），而为了实现（运行时）对数据变更做出响应需要，React 采用基于类（Class）的组件设计！
- React 一直都提倡使用**函数组件**，但是有时候需要使用 `state` 或者其他一些功能时，只能使用**类组件**，因为函数组件没有实例，没有生命周期函数，只有类组件才有;
- Hooks 是 React 16.8 新增的特性，它可以在不编写 class 的情况下使用 state 以及其他的 React 特性
- 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以直接在现有的函数组件中使用 `Hooks`
  凡是 `use` 开头的 React API 都是 `Hooks`

## 二、Hooks 解决的问题

### 1. 类组件的不足

- 状态逻辑难复用： 在组件之间复用状态逻辑很难，可能要用到 `render props` （渲染属性）或者 `HOC`（高阶组件），但无论是渲染属性，还是高阶组件，都会在原先的组件外包裹一层父容器（一般都是 div 元素），导致层级冗余

HOC 使用（老生常谈）的问题

- 嵌套地狱，每一次 HOC 调用都会产生一个组件实例
- 可以使用类装饰器缓解组件嵌套带来的可维护性问题，但装饰器本质上还是 HOC
- 包裹太多层级之后，可能会带来 props 属性的覆盖问题

**Render Props：**

- 数据流向更直观了，子孙组件可以很明确地看到数据来源
- 但本质上`Render Props`是基于闭包实现的，大量地用于组件的复用将不可避免地引入了 callback hell 问题
- 丢失了组件的上下文，因此没有`this.props`属性，不能像 HOC 那样访问`this.props.children`
- 趋向复杂难以维护：

  - 在生命周期函数中混杂不相干的逻辑（如：在 componentDidMount 中注册事件以及其他的逻辑，在 componentWillUnmount 中卸载事件，这样分散不集中的写法，很容易写出 bug ）
  - 类组件中到处都是对状态的访问和处理，导致组件难以拆分成更小的组件

- this 指向问题：父组件给子组件传递函数时，必须绑定 `this`，react 中的组件四种绑定 `this` 方法的区别
- webpack 编译后 class 的 size 要比 function 组件大，性能也没 function 好（Function Component 编译后就是一个普通的 function，function 对 js 引擎是友好的）
- Function Component 是纯函数，利于组件复用和测试

## Hooks 优势

- 能优化类组件的三大问题
- 能在无需修改组件结构的情况下复用状态逻辑（自定义 Hooks ）
- 能将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）
- 副作用的关注点分离：副作用指那些没有发生在数据向视图转换过程中的逻辑，如 ajax 请求、访问原生 dom 元素、本地持久化缓存、绑定/解绑事件、添加订阅、设置定时器、记录日志等。以往这些副作用都是写在类组件生命周期函数中的。而 useEffect 在全部渲染完毕后才会执行，useLayoutEffect 会在浏览器 layout 之后，painting 之前执行。

## 注意事项

- 只能在函数内部的最外层调用 Hook，不要在循环、条件判断或者子函数中调用
- 只能在 React 的函数组件中调用 Hook，不要在其他 JavaScript 函数中调用

## hooks

![](./image/hooks-process.png)

## React Hooks 能够让函数组件拥有内部状态的基本原理

利用闭包，记住了上一次的值，如下

```javascript
const useState = (function () {
  let state = null
  return function (value) {
    // 第一次调用时没有初始值，因此使用传入的初始值赋值
    state = state || value
    function dispatch(newValue) {
      state = newValue
      console.log('render happen')
    }
    return [state, dispatch]
  }
})()

function Demo() {
  const [counter, setCounter] = useState('0')
  console.log(counter)
  return function (value) {
    setCounter(value)
  }
}

const render = Demo() // log 0
render(12)
Demo() // log 12
Demo() // log 12
```

更为相似的例子

```typescript
// state.js
let state = null

export const useState = (value: number) => {
  // 第一次调用时没有初始值，因此使用传入的初始值赋值
  state = state || value

  function dispatch(newValue) {
    state = newValue
    // 假设此方法能触发页面渲染
    render()
  }

  return [state, dispatch]
}
```

在其他模块中引入并使用。

```typescript jsx
import React from 'react'
import { useState } from './state'

function Demo() {
  // 使用数组解构的方式，定义变量
  const [counter, setCounter] = useState(0)

  return (
    <div onClick={() => setCounter(counter + 1)}>
      hello world, {counter}
    </div>
  )
}

export default Demo()
```

执行上下文 state（模块 state）以及在 state 中创建的函数 useState

当 useState 在 Demo 中执行时，访问了 state 中的变量对象，那么闭包就会产生。

react hooks 提供的 api，大多都有记忆功能。例如

- useState
- useEffect
- useLayoutEffect
- useReducer
- useRef
- useMemo 记忆计算结果
- useCallback 记忆函数体

## useState

每次渲染都是独立的闭包， `setTimeout`中打印的是上一次的值

```jsx harmony
function Test() {
  console.log('render 1')
  const [state, setSate] = useState(0)
  function AlertNum() {
    setSate(state + 1)
    setTimeout(() => {
      setSate((number) => number + 1)
      // setState(state+1) // 加1不起作用，因为这个state是之前的那个及0，而之前就已经加1变成1了，
      // setState(state + 2)// state会变成2
      alert(state) // 0
    }, 3000)
  }
  return (
    <div>
      <p>{state}</p>
      <button onClick={() => setSate((prev) => prev + 1)}>add</button>
      <br />
      <button onClick={AlertNum}>AlertNum</button>
    </div>
  )
}
```

```jsx harmony
function Demo() {
	console.log('render 1')
	const [state, setState] = useState(111)

	const [obj, setObj] = useState({
		a: 1,
		b: 2
	})
	function test() {
		obj.a = 2
		// setObj({ ...obj, a: 12})
		setObj(obj) // 不会导致render,所以不会渲染，但是当state变化，Demo组件会重新render, 而由于闭包的特性， obj的a已经变化，所以显示的a也会变成2
		console.log(obj)
	}
    return ()
}
```

使用 memo 的区别

```jsx
import React, { memo, useState } from 'react'

function Counter1(props) {
  console.log(`Counter ${props.name} render`)

  // 这个函数只在初始渲染时执行一次，后续更新状态重新渲染组件时，该函数就不会再被调用
  function getInitState() {
    return { number: props.number }
  }

  let [counter, setCounter] = useState(getInitState)
  let [counter1, setCounter2] = useState(props.number) // props变化时，这个counter1依然是第一次的值
  return (
    <>
      <h1>name: {props.name}</h1>
      <p>{counter.number}</p>
      <button onClick={() => setCounter({ number: counter.number + 1 })}>
        +
      </button>
      <button onClick={() => setCounter(counter)}>setCounter</button>
    </>
  )
}

const Counter1Memo = memo(Counter1)

function Test() {
  console.log('render 1')
  const [state, setSate] = useState(0)

  function AlertNum() {
    setSate(state + 1)
    setTimeout(() => {
      setSate((number) => number + 1)
      // setState(state+1) // 加1不起作用，因为这个state是之前的那个及0，而之前就已经加1变成1了，
      // setState(state + 2)// state会变成2
      alert(state) // 0
    }, 3000)
  }
  // 但state变化时
  // name 是1,2,3的都要render
  return (
    <div>
      <p>{state}</p>
      <button onClick={() => setSate((prev) => prev + 1)}>add</button>
      <br />
      <button onClick={AlertNum}>AlertNum</button>
      <Counter1 number={state} name="1" key={1} />
      <Counter1 number={12} name="2" key={2} />
      <Counter1Memo number={state} name="3" key={3} />
      <Counter1Memo number={12} name="4" key={4} />
    </div>
  )
}

export default Test
```

```jsx harmony
import React, { memo, useCallback, useMemo, useState } from 'react'

function SubCounter({ onClick, data }) {
  console.log('SubCounter render')
  return <button onClick={onClick}>{data.number}</button>
}

const SubCounter2 = memo(SubCounter)

let oldData
let oldAddClick
export default function Counter2() {
  console.log('Counter render')
  const [name, setName] = useState('计数器')
  const [number, setNumber] = useState(0)
  // 父组件更新时，这里的变量和函数每次都会重新创建，那么子组件接受到的属性每次都会认为是新的
  // 所以子组件也会随之更新，这时候可以用到 useMemo
  // 有没有后面的依赖项数组很重要，否则还是会重新渲染
  // 如果后面的依赖项数组没有值的话，即使父组件的 number 值改变了，子组件也不会去更新
  // const data = useMemo(()=>({number}),[]);
  const data = useMemo(() => ({ number }), [number]) // number变化了sub才会重新render,name变了不会
  console.log('data===oldData ', data === oldData)
  oldData = data

  // 有没有后面的依赖项数组很重要，否则还是会重新渲染
  const addClick = useCallback(() => {
    setNumber(number + 1)
  }, [number]) // number变化了sub才会重新render,name变了不会
  console.log('addClick===oldAddClick ', addClick === oldAddClick)
  oldAddClick = addClick
  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <SubCounter2 data={data} onClick={addClick} />
    </>
  )
}
```

## useEffect

- [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)

- [源码解读](https://www.jianshu.com/p/a838d8c22089)

### useEffect 解决了哪些问题

1. 函数组件没有生命周期。

2. ajax、事件绑定等业务逻辑耦合在生命周期中

3. 业务逻辑散乱在不同的生命周期中

Effect Hook 可以让你在函数组件中执行副作用操作。数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用。类比于 class component，可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

在 function 组件中，**每当 DOM 完成一次渲染，都会有对应的副作用执行**，useEffect 用于提供自定义的执行内容，它的第一个参数（作为函数传入）就是自定义的执行内容。为了避免反复执行，传入第二个参数（由监听值组成的数组）作为比较(浅比较)变化的依赖，比较之后值都保持不变时，副作用逻辑就不再执行。
useEffect 还是异步执行的，所谓的异步就是被 React 使用 requestIdleCallback 封装的，只在浏览器空闲时候才会执行，这就保证了不会阻塞浏览器的渲染过程。

- 1. 只在第一次渲染时执行，第二个参数传空数组。即没有传入比较变化的变量，则比较结果永远都保持不变，那么副作用逻辑就只能执行一次。

```jsx harmony
const [list, setList] = useState(0)

// DOM渲染完成之后副作用执行
useEffect(() => {
  recordListApi().then((res) => {
    setList(res.data)
  })
  // 记得第二个参数的使用
}, [])
```

- 2. 创造一个变量，来作为变化值，实现目的的同时防止循环执行

```jsx harmony
import React, { useState, useEffect } from 'react'
import './style.scss'

export default function AnimateDemo() {
  const [list, setList] = useState(0)
  const [loading, setLoading] = useState(true)

  // DOM渲染完成之后副作用执行
  useEffect(() => {
    if (loading) {
      // 自身判断是否执行
      recordListApi().then((res) => {
        setList(res.data)
        setLoading(false)
      })
    }
  }, [loading])

  return (
    <div className="container">
      <button onClick={() => setLoading(true)}>点击刷新</button>

      <FlatList data={list} />
    </div>
  )
}
```

3. return 一个 clear 函数清楚副作用

- 每次副作用执行，都会返回一个新的 clear 函数
- **clear 函数会在下一次副作用逻辑之前执行**（DOM 渲染完成之后）
- 组件销毁也会执行一次

和`componentWillUnmount`不一样，`componentWillUnmount`整个过程中只执行一次。

例子

```js
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange)
  function clear() {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange)
  }
  return clear
})
```

假设在组件的使用过程中，外部传入的 props 参数 id，改变了两次，第一次传入`id: 1`， 第二次传入`id: 2`

整个过程是：

1. 传入`props.id = 1`
2. 组件渲染
3. DOM 渲染完成，副作用逻辑执行，返回清除副作用函数`clear`，命名为`clear1`
4. 传入`props.id = 2`
5. 组件渲染
6. 组件渲染完成，`clear1`执行
7. 副作用逻辑执行，返回另一个`clear`函数，命名为`clear2`
8. 组件销毁，`clear2`执行

下面的打印顺序是：

```jsx harmony
import React, { useState, useEffect } from 'react'

export default function AnimateDemo() {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('setCounter')
      setCounter(counter + 1)
    }, 3000)
    console.log('effect:', timer)

    return () => {
      console.log('clear:', timer)
      clearTimeout(timer)
    }
  })

  console.log('before render')

  return (
    <div className="container">
      <div className="el">{counter}</div>
    </div>
  )
}
```

```git
before render
effect: 0
setCounter --- 3s后
before render
clear: 0 -- 第二次渲染完成，执行上一次返回的clear函数
effect: 1
before render
clear: 1
effect: 2
before render
clear: 2
...
clear: xx -- 组件销毁时
```

第一次渲染是打印 render,并且执行副作用函数, 打印 effect，并且返回清楚副作用的函数 clear, **3 秒后**打印 setCounter，执行`setCounter`，
组件重新渲染，打印 render，渲染完成后执行上一次的 clear，接着执行副作用函数，一直循环，直到销毁时执行 clear 函数。

### 和 setInterval

- [React Hooks 中的闭包问题](https://juejin.cn/post/6847902217031122951)

- [使用 React Hooks 声明 setInterval](https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/)

```jsx harmony
import React, { useState, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return <div style={{ fontSize: '100px' }}>{count}</div>
}
```

错误示例，初始显示 0，一秒后永远都会显示 1，同样的代码用 class 组件来实现，就不会有这个问题， class 组件和函数组件的代码的差异在于，class 组件中的 this.state 是可变的！每一次的更新都是对 state 对象的一个更新，一次又一次的 setInterval 中引用的都会是新 state 中的值。
然而在函数组件中情况就不一样了。函数组件由于每次更新都会经历重新调用的过程，useEffect(callback) 中的回调函数都是全新的，这样其中引用到的 state 值将只跟当次渲染绑定。

```jsx harmony
import React, { useState, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      // 这里
      setCount((prevState) => prevState + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return <div style={{ fontSize: '100px' }}>{count}</div>
}
```

使用 useRef

```typescript jsx
import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [counter, setCounter] = useState(0)

  const ref = useRef(null)

  function addCounter() {
    console.log(counter)
    setCounter(counter + 1)
  }

  useEffect(() => {
    ref.current = addCounter // 重新赋值current，实际上是addCounter函数每次重新生成，所以引用的counter是最新的
  })

  useEffect(() => {
    const id = setInterval(() => {
      ref.current && ref.current()
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p>{counter}</p>
}

export default App
```

```jsx harmony
function Counter() {
  const [count, setCount] = useState(0)
  const savedCallback = useRef()

  function callback() {
    setCount(count + 1)
  }

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    let id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return <h1>{count}</h1>
}
```

自定义 hooks

```jsx harmony
function Counter() {
  const [count, setCount] = useState(0)

  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  return <h1>{count}</h1>
}

function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    let id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}
```

### useEffect 中不能使用 async function

- [React useEffect 不支持 async function 你知道吗？](https://zhuanlan.zhihu.com/p/425129987)

ahook 的 useAsyncEffect

```ts
import type { DependencyList } from 'react'
import { useEffect } from 'react'

function useAsyncEffect(
  effect: () => AsyncGenerator<void, void, void> | Promise<void>,
  deps: DependencyList
) {
  function isGenerator(
    val: AsyncGenerator<void, void, void> | Promise<void>
  ): val is AsyncGenerator<void, void, void> {
    return typeof val[Symbol.asyncIterator] === 'function'
  }
  useEffect(() => {
    const e = effect()
    let cancelled = false
    async function execute() {
      if (isGenerator(e)) {
        while (true) {
          const result = await e.next()
          if (cancelled || result.done) {
            break
          }
        }
      } else {
        await e
      }
    }
    execute()
    return () => {
      cancelled = true
    }
  }, deps)
}

export default useAsyncEffect
```

### 使用 guide

React 中有两个重要的概念：

1. Rendering code（渲染代码）
2. Event handlers（事件处理器）

- `Rendering code`指「开发者编写的组件渲染逻辑」，最终会返回一段`JSX`。比如，如下组件内部就是 Rendering code：

```tsx
function App() {
  const [name, update] = useState('Song')

  return <div>Hello {name}</div>
}
```

Rendering code 的特点是：他应该是**不带副作用的纯函数**。

- `Event handlers`是「**组件内部包含的函数**」，用于执行用户操作，可以**包含副作用**。

下面这些操作都属于 Event handlers：

- 更新 input 输入框
- 提交表单
- 导航到其他页面

如下例子中组件内部的`changeName`方法就属于`Event handlers`：

```tsx
function App() {
  const [name, update] = useState('Song')

  const changeName = () => {
    update('Sysuke')
  }

  return <div onClick={changeName}>Hello {name}</div>
}
```

但是，并不是所有副作用都能在`Event handlers`中解决。

比如，在一个聊天室中，「发送消息」是用户触发的，应该交给`Event handlers`处理。

除此之外，聊天室需要随时保持和服务端的长连接，「保持长连接」的行为属于**副作用**，但并不是用户行为触发的。

对于这种：**在视图渲染后触发的副作用，就属于 effect，应该交给 useEffect 处理。**

#### conclusion

当我们编写组件时，应该尽量将组件编写为[纯函数](https://beta.reactjs.org/learn/keeping-components-pure)。

对于组件中的副作用，首先应该明确： 是「用户行为触发的」还是「视图渲染后主动触发的」？

- 对于前者，将逻辑放在`Event handlers`中处理。
- 对于后者，使用`useEffect`处理。

- [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects)

### 执行顺序

```tsx
const Child: FC<{ name: string }> = ({ name }) => {
  useEffect(() => {
    console.log(name + ' effect')
    return () => {
      console.log(name + ' clear')
    }
  }, [])
  return <div>{name}</div>
}
const Parent = () => {
  useEffect(() => {
    console.log('Parent effect')
    return () => {
      console.log('Parent clear')
    }
  }, [])
  return (
    <div>
      Parent
      <Child name="child1" />
      <Child name="child2" />
    </div>
  )
}

const App = () => {
  const [show, setShow] = useState(true)
  return (
    <>
      <button onClick={() => setShow(!show)}>show</button>
      {show && <Parent />}
    </>
  )
}
```

![](./image/useEffect-render.png)

如果是`StrictMode`组件会 render 两次

子组件的 `effet` 首先执行，然后执行父组件的

子组件的 `clean` 执行，然后父组件的 `clean` 也执行，顺序和 `effect` 执行顺序一致

## useLayoutEffect

```js
useLayoutEffect(() => {
  // do side effects
  return () => /* cleanup */
}, [dependency, array]);
```

会在所有的 `DOM` 变更之后**同步**调用 effect。可以使用它来读取 DOM 布局并**同步触发重渲染**。**在浏览器执行绘制之前**，useLayoutEffect 内部的更新计划将被同步刷新。这是和`useEffect`唯一的区别。

1. `useLayoutEffect`和`componentDidMount`和`componentDidUpdate`触发时机一致（都在在 DOM 修改后且浏览器渲染之前）；
2. `useLayoutEffect`要比`useEffect`更早的触发执行；
3. `useLayoutEffect`会阻塞浏览器渲染，切记执行同步的耗时操作。

[解析 useEffect 和 useLayoutEffect](https://juejin.cn/post/6862624266723000328)

[深入理解 React useLayoutEffect 和 useEffect 的执行时机](https://blog.csdn.net/yunfeihe233/article/details/106616674/)

useEffect 和 useLayoutEffect 的区别

useEffect 在渲染时是异步执行，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。

useLayoutEffect 在渲染时是同步执行，其执行时机与 componentDidMount，componentDidUpdate 一致

除非要修改 DOM 并且不让用户看到修改 DOM 的过程，才考虑使用 useLayoutEffect，否则应当使用 useEffect。

```jsx harmony
export default function FuncCom() {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    if (counter === 12) {
      // 耗时的操作 500ms
      const pre = Date.now()
      while (Date.now() - pre < 500) {}
      setCounter(2)
    }
  })
  return (
    <div
      style={{
        fontSize: '100px'
      }}
    >
      <div onClick={() => setCounter(12)}>{counter}</div>
    </div>
  )
}
```

初始屏幕上是 0，当点击触发 setCounter 后，屏幕上先是出现了 12，最后变为了 2:

换成了 useLayoutEffect 后，屏幕上只会出现 0 和 2，这是因为 useLayoutEffect 的同步特性，会在浏览器渲染之前同步更新 DOM 数据，哪怕是多次的操作，也会在渲染前一次性处理完，再交给浏览器绘制。这样不会导致闪屏现象发生。

但如果在`if (counter === 12) {`这里 F12 debug，屏幕上会显示 12。

## 自定义 Hooks

自定义 hooks 都会以`use`开头，以表示该方法**只能在函数式组件中使用**。感觉就是对原有函数组件中依赖于 state 的逻辑的抽离

自定义 Hooks 实现了**逻辑片段复用**

而和普通函数更强一点的是，自定义 hooks 还能够封装异步逻辑片段。

example

```typescript jsx
// .useEqualArr.tsx
import { useState } from 'react'

function equalArr(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false
  }
  if (a.length === 0 && b.length === 0) {
    return true
  }
  return a.every((item, i) => item === b[i])
}

export default function useEqualArr() {
  const [arrA, setArrA] = useState<number[]>([])
  const [arrB, setArrB] = useState<number[]>([])
  const isEqual = equalArr(arrA, arrB)

  return {
    arrA,
    setArrA,
    arrB,
    setArrB,
    isEqual
  }
}
```

使用

```typescript jsx
import React from 'react'
import useEqualArr from './useEqualArr'

export default function EqualArr() {
  const { arrA, arrB, setArrA, setArrB, isEqual } = useEqualArr()
}
```

example：封装一个公用页面初次加载 Hooks

```typescript jsx
import { useState, useEffect } from 'react'

export default function useInitial<T, P, V>(
  api: (params: P) => Promise<T>,
  params: P,
  defaultData: V
) {
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState(defaultData)
  const [errMsg, setErrmsg] = useState('')

  useEffect(() => {
    if (!loading) {
      return
    }
    getData()
  }, [loading])

  function getData() {
    api(params)
      .then((res) => {
        setResponse(res)
      })
      .catch((e) => {
        setErrmsg(errMsg)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    loading,
    setLoading,
    response,
    errMsg
  }
}
```

在页面中使用

```typescript jsx
export default function FunctionDemo() {
  // 只需要传入api， 对应的参数与返回结果的初始默认值即可
  const { loading, setLoading, response, errMsg } = useInitial(
    api,
    { id: 10 },
    {}
  )
}
```

刷新页面: `setLoading(true);`

### useReducer

```typescript jsx
import React, { useReducer } from 'react'
import { Button } from 'antd'

enum Actions {
  Increment = 'Increment',
  Decrement = 'Decrement',
  Rest = 'Rest'
}

const Reducer = (state: number, action: Actions) => {
  switch (action) {
    case Actions.Increment:
      return state + 1
    case Actions.Decrement:
      return state - 1
    case Actions.Rest:
      return 0
    default:
      return state
  }
}

export default function ReactHooksWay() {
  const initialState: number = 0
  const [counter, dispatch] = useReducer(Reducer, initialState)
  return (
    <div>
      <h3>counter: {counter}</h3>
      <Button onClick={() => dispatch(Actions.Increment)}>
        {Actions.Increment}
      </Button>
      <Button onClick={() => dispatch(Actions.Decrement)}>
        {Actions.Decrement}
      </Button>
      <Button onClick={() => dispatch(Actions.Rest)}>
        {Actions.Rest}
      </Button>
    </div>
  )
}
```

## useContext

ContextProvider

```typescript jsx
import React, { createContext, useState, Dispatch, ReactNode } from 'react'

interface Injected {
  counter: number
  setCounter: Dispatch<any>
  increment: () => any
  decrement: () => any
}
// eslint-disable-next-line
export const context = createContext<Injected>({} as Injected)

interface Props {
  children?: ReactNode
}

export function CounterProvider({ children }: Props) {
  const [counter, setCounter] = useState(0)

  const value = {
    counter,
    setCounter,
    increment: () => setCounter(counter + 1),
    decrement: () => setCounter(counter - 1)
  }

  return <context.Provider value={value}>{children}</context.Provider>
}
```

```typescript jsx
import React, { useContext } from 'react'
import { Button } from 'antd'
import { context, CounterProvider } from './ContextProvider'

function Counter() {
  const { counter = 0, increment, decrement } = useContext(context)

  return (
    <div style={{ width: '400px' }}>
      <h3>第一层组件</h3>
      <div
        style={{ width: '40px', margin: '100px auto', fontSize: '40px' }}
      >
        {counter}
      </div>
      <Button onClick={increment}>递增</Button>
      <Button onClick={decrement}>递减</Button>
      <TwoChild />
      <MemoTwoChild />
    </div>
  )
}

function TwoChild() {
  console.log('render')
  return (
    <div>
      <h2>第二层组件</h2>
      <p>hello</p>
      <ThirdChild />
    </div>
  )
}

const MemoTwoChild = React.memo(TwoChild) // context变化时，不会打印render

function ThirdChild() {
  const { counter = 0, increment, decrement } = useContext(context)

  return (
    <div style={{ width: '200px', margin: 'auto' }}>
      <h3>第三层组件</h3>
      <div
        style={{ width: '40px', margin: '100px auto', fontSize: '40px' }}
      >
        {counter}
      </div>
      <Button onClick={increment}>递增</Button>
      <Button onClick={decrement}>递减</Button>
    </div>
  )
}

export default () => (
  <CounterProvider>
    <Counter />
  </CounterProvider>
)
```

## useRef

在函数式组件中，`useRef` 是一个返回可变引用对象的函数。该对象`.current`属性的初始值为 useRef 传入的参数`initialVale`。

返回的对象将在组件整个生命周期中持续存在。当 `useRef` 的内容发生变化时，它不会通知。更改`.current`属性不会导致重新 render 呈现。因为它一直是一个引用。

`const ref = useRef(initialValue);`

通常情况下，useRef 有两种用途，

1. 访问 DOM 节点，或者 React 元素
   自定义组件 ref，使用` React.createRef()`或者`useRef`，外加`React.forwardRef`

```jsx harmony
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef()
;<FancyButton ref={ref}>Click me!</FancyButton>
```

hooks way

```typescript jsx
import React, { forwardRef, useState, ChangeEvent } from 'react'

export interface InputProps {
  value?: string
  onChange?: (value: string) => any
}

function Input({ value, onChange }: InputProps, ref: any) {
  const [_value, setValue] = useState(value || '')

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)
    onChange && onChange(value)
  }

  return (
    <div>
      自定义Input组件
      <input value={_value} onChange={_onChange} ref={ref} />
    </div>
  )
}

export default forwardRef(Input)
```

2. 保持变量引用

和`createRef`的区别

> `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

`useRef` 在 react hook 中的作用, 正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒子, 你可以存放任何东西. **`createRef` 每次渲染都会返回一个新的引用，而 `useRef` 每次都会返回相同的引用**。

```typescript jsx
import React, { useRef, useEffect } from 'react'

export default function Timer() {
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('do something')
    }, 1000)

    // 组件卸载时，清除定时器
    return () => {
      timerRef.current && clearInterval(timerRef.current)
    }
  }, [])

  return <div>// ...</div>
}
```

example: 界面上显示出上一个 count 的值

```typescript jsx
import React, { useState, useRef, useEffect } from 'react'

const usePrevious = (state: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = state
  })

  return ref.current
}

export default function () {
  const [counter, setCounter] = useState(0)
  const prevCounter = usePrevious(counter)

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>+ 1</button>
      <button onClick={() => setCounter(counter - 1)}>- 1</button>
      <p>
        Now: {counter}, before: {prevCounter}
      </p>
    </div>
  )
}
```

> explain: **`useRef` 每次都会返回相同的引用**，第一次渲染时，counter 为 0，而执行到自定义的 hook,`usePrevious`时，传入的 state 是 0，
> 但`useEffect`副作用函数是在 dom 渲染完执行，所以`return`的值是`undefined`,页面的`prevCounter`则没有显示值。
> 当`setCounter`时，函数重新运行，取到的是之前传入的`counter`,所以页面显示`counter`是 1，`prevCounter`是 0。

## useImperativeHandle

`useImperativeHandle`可以让我们在使用`ref`时自定义暴露给父组件的实例值。

```typescript jsx
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  Ref,
  useState,
  ChangeEvent
} from 'react'

export interface InputProps {
  value?: string
  onChange?: (value: string) => any
}

export interface XInput {
  focus: () => void
  blur: () => void
  setInputValue: (value: string) => void
}

function Input({ value, onChange }: InputProps, ref: Ref<XInput>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [_value, setValue] = useState(value || '')

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current && inputRef.current.focus()
    },
    blur: () => {
      inputRef.current && inputRef.current.blur()
    },
    setInputValue: (value: string) => {
      setValue(value)
    }
  }))

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value)
    setValue(value)
    onChange && onChange(value)
  }

  return (
    <div>
      自定义Input组件
      <input value={_value} onChange={_onChange} ref={inputRef} />
    </div>
  )
}

export default forwardRef(Input)
```

使用

```typescript jsx
import React, { useRef, useState } from 'react'
import Input from './components/Input'

const Demo = () => {
  const textInput = useRef<any>(null)
  const [text, setText] = useState('')

  const focusTextInput = () => {
    if (textInput.current) {
      textInput.current.focus()
      textInput.current.setInputValue('hello world')
    }
  }

  return (
    <>
      <Input ref={textInput} onChange={setText} value={text} />
      <button onClick={focusTextInput}>
        点击我，input组件获得焦点并设置input value
      </button>
      <div>{text}</div>
    </>
  )
}

export default Demo
```

compare: component 父组件调用子组件方法

```jsx harmony
import React, { Component } from 'react'

export default class Parent extends Component {
  onRef = (ref) => {
    this.child = ref
  }

  click = () => {
    this.child.myName()
  }

  render() {
    return (
      <div>
        <Child onRef={this.onRef} />
        <button onClick={this.click}>click</button>
      </div>
    )
  }
}

class Child extends Component {
  componentDidMount() {
    this.props.onRef(this)
  }

  myName = () => console.log('child log')

  render() {
    return <p>child</p>
  }
}
```

## useMemo

记忆函数`useMemo`和`useCallback`也是靠闭包实现，记忆函数并非完全没有代价，我们需要创建闭包，占用更多的内存，用以解决计算上的冗余。

`useMemo`缓存计算结果。它接收两个参数，第一个参数为计算过程(回调函数，必须返回一个结果)，第二个参数是依赖项(数组)，当依赖项中某一个发生变化，结果将会重新计算。
如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值；

```typescript
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T
```

example: base 只会在第一次渲染时计算及运行`expensiveFn`, `state`变化重新 render 时，不会在运行，除非`useMemo`第二个参数没有或者，是`[num]`

```typescript jsx
import React, { useState, useMemo } from 'react'
import { Divider, Button } from 'antd'

export default function () {
  const [num, setNum] = useState(0)

  // 一个非常耗时的一个计算函数
  // result 最后返回的值是 49995000
  function expensiveFn() {
    let result = 0

    for (let i = 0; i < 10000; i++) {
      result += i
    }

    console.log(result) // 49995000
    return result
  }

  // const base = expensiveFn()

  const base = useMemo(expensiveFn, [])

  return (
    <div>
      <h3>example one</h3>
      <h3>count：{num}</h3>
      <Button onClick={() => setNum(num + base)}>+1</Button>
    </div>
  )
}
```

## useCallback

useCallback 的使用几乎与 useMemo 一样，不过 useCallback 缓存的是一个函数体，当依赖项中的一项发现变化，函数体会重新创建。
`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`

1. 函数比较复杂，用`useCallback`避免重复创建同样方法的负担
2. 当函数当做 props 传递给子组件时，可以使用`useCallback`，避免当父组件重新`render`时，重新创建发送导致子组件更新。

```typescript
function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T
```

![](./image/usecallback.png)

## 优化总结

React 的性能优化方向主要是两个：**一个是减少重新 render 的次数(或者说减少不必要的渲染)**，**另一个是减少计算的量。**

一个组件重新重新渲染，一般三种情况：

1. 要么是组件自己的状态改变
2. 要么是父组件重新渲染，导致子组件重新渲染，但是父组件的 props 没有改变
3. 要么是父组件重新渲染，导致子组件重新渲染，但是父组件传递的 props 改变

减少不必要的渲染，可以使用`use.memo`和`useCallback`，或者之前的`shouldComponentUpdate`和`pureComponent`

**`useMemo` 做计算结果缓存**

## 原理

- [前端面试必考题：React Hooks 原理剖析](https://juejin.cn/post/6844904205371588615)
- [React Hooks 源码解析](https://juejin.cn/post/6844904080758800392)
- [一文吃透 react-hooks 原理](https://juejin.cn/post/6944863057000529933)

useState 和 useReducer 都是关于状态值的提取和更新，从本质上来说没有区别，从实现上，可以说 useState 是 useReducer 的一个简化版，其背后用的都是同一套逻辑。

React Hooks 保存状态的位置其实与类组件的一致：

- 两者的状态值都被挂载在组件实例对象`FiberNode`的`memoizedState`属性中。
- 两者保存状态值的**数据结构完全不同**；类组件是直接把 `state` 属性中挂载的这个开发者自定义的对象给保存到 memoizedState 属性中；而 `React Hooks` 是用**链表**来保存状态的，`memoizedState`属性保存的实际上是这个链表的**头指针**。
  链表的节点:

```flow js
// react-reconciler/src/ReactFiberHooks.js
export type Hook = {
  memoizedState: any, // 最新的状态值
  baseState: any, // 初始状态值，如`useState(0)`，则初始值为0
  baseUpdate: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null, // 临时保存对状态值的操作，更准确来说是一个链表数据结构中的一个指针
  next: Hook | null // 指向下一个链表节点
}
```

hooks 分为`mount阶段`和`update阶段`

在 mount 阶段，每当调用 Hooks 方法，比如`useState`，`mountState`就会调用`mountWorkInProgressHook `来创建一个 Hook 节点，并把它添加到`Hooks`链表上

useState 和 useReducer 都是使用了一个`queue链表`来存放每一次的更新。以便后面的`update阶段`可以返回最新的状态。每次调用`dispatchAction`方法(useState,useReducer 第二个参数返回的修改 state 的函数）的时候，就会形成一个新的 update 对象，添加到 queue 链表上，
而且这个是一个**循环链表**。`dispatchAction`方法的实现：
::: details 实现

```javascript
// react-reconciler/src/ReactFiberHooks.js
// 去除特殊情况和与fiber相关的逻辑
function dispatchAction(fiber, queue, action) {
  const update = {
    action,
    next: null
  }
  // 将update对象添加到循环链表中
  const last = queue.last
  if (last === null) {
    // 链表为空，将当前更新作为第一个，并保持循环
    update.next = update
  } else {
    const first = last.next
    if (first !== null) {
      // 在最新的update对象后面插入新的update对象
      update.next = first
    }
    last.next = update
  }
  // 将表头保持在最新的update对象上
  queue.last = update
  // 进行调度工作
  scheduleWork()
}
```

:::

### useEffect

useEffect 的保存方式与 `useState / useReducer` 类似，也是以链表的形式挂载在`FiberNode.updateQueue`中。

mount 阶段：**mountEffect**

1. 根据函数组件函数体中依次调用的 `useEffect` 语句，构建成一个链表并挂载在`FiberNode.updateQueue`中，链表节点的数据结构为：

```flow js
const effect: Effect = {
  tag, // 用来标识依赖项有没有变动
  create, // 用户使用useEffect传入的函数体
  destroy, // 上述函数体执行后生成的用来清除副作用的函数
  deps, // 依赖项列表
  next: (null: any)
}
```

2. 组件完成渲染后，遍历链表执行。

update 阶段：**updateEffect**

1. 同样在依次调用 `useEffect` 语句时，判断此时传入的依赖列表，与链表节点`Effect.deps`中保存的是否一致（基本数据类型的值是否相同；对象的引用是否相同），如果一致，则在`Effect.tag`标记上`NoHookEffect`。

**执行阶段**

在每次组件渲染完成后，就会进入 useEffect 的执行阶段：`function commitHookEffectList()`：

1. 遍历链表
2. 如果遇到`Effect.tag`被标记上`NoHookEffect`的节点则跳过。
3. 如果`Effect.destroy为`函数类型，则需要执行该清除副作用的函数（至于这`Effect.destroy`是从哪里来的，下面马上说到）
4. 执行`Effect.create`，并将执行结果保存到`Effect.destroy`（如果开发者没有配置 return，那得到的自然是 undefined 了，也就是说，开发者认为对于当前 `useEffect` 代码段，不存在需要清除的副作用）；注意由于闭包的缘故，
   `Effect.destroy`实际上可以访问到本次`Effect.create`函数作用域内的变量。

**是先清除上一轮的副作用，然后再执行本轮的 effect 的。**
