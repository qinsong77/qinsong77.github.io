---
title: Jest
---



[Jest](https://jestjs.io) 是 Facebook 出品的一个 JavaScript 开源测试框架。相对其他测试框架，其一大特点就是就是内置了常用的测试工具，比如零配置、自带断言、测试覆盖率工具等功能，实现了开箱即用。

单元测试还有其他比如Mocha、Ava等，但在React中选Jest就完事儿.

> 断言指的是一些布尔表达式，在程序中的某个特定点该表达式值为真，判断代码的实际执行结果与预期结果是否一致，而断言库则是将常用的方法封装起来

## 匹配器matchers

以sum函数为例子

```js
// sum.js
export function sum(a, b) {
    return a + b
}
```

测试脚本

```js
// sum.test.js
import { sum } from './sum'

describe('sum function', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3)
    })
})
```

- describe 是 test suite（测试套件）
- test方法我们称做测试用例，接收两个参数，第一个参数是测试的名称，第二个参数是个函数，在函数内可以写一些测试逻辑
- expect顾名思义就是期望的意思，expect(sum(1, 2)).toBe(3)意思就是期望这个sum(1, 2)的返回值和3相等，整体称做为断言
- toBe就是一个匹配器，匹配expect的值是否和匹配器中的值相等

#### `.toBe(value)`：匹配值，相当于`===`

注意点：

- 不能用于测试浮点数比如`expect(0.1+0.2).toBe(0.3)`，如果需要这样测试，可以使用toBeCloseTo
- 不能用于引用类型的检查

#### .toEqual(value)：两个对象的原始值是否相等，只检查内容，不检查引用

```js
const can1 = {
    flavor: 'grapefruit',
    ounces: 12
}
const can2 = {
    flavor: 'grapefruit',
    ounces: 12
}

describe('the La Croix cans on my desk', () => {
    test('have all the same properties', () => {
        expect(can1).toEqual(can2)
    })
    test('are not the exact same can', () => {
        expect(can1).not.toBe(can2)
    })
})
```

注意：不能用于两个抛出异常的匹配，而该使用toThrow

.toBeNull()：匹配null， 即toBe(null)

.toBeUndefined()：匹配undefined

.toBeNaN()：匹配NaN

toBeTruthy()：匹配结果为true的值

.toBeFalsy()：匹配结果为false的值

在js中false, 0, '', null, undefined, NaN都会被自动转换成false

toBeDefined()：匹配已定义的值

.not：对后续的匹配取反

.toBeGreaterThan(number)：匹配大于number的数字

- .toBeGreaterThanOrEqual(number)：匹配大于等于number的数字
- .toBeLessThan(number)：匹配小于number的数字
- toBeLessThanOrEqual(number)：匹配小于等于number的数字
- .toBeCloseTo(number, numDigits?)：匹配指定位数的浮点数
- toMatch(regexpOrString)：检查字符串是否匹配
- .toMatchObject(object)：匹配对象/数组是否属于子集
- .toContain(item)：匹配数组/Set/字符串中是否包含item,不能检查arr/set中的对象，比如[{ name: 'Jsoning' }]
- .toContainEqual(item)：和.toContain类似，必须完全匹配，但是可以匹配数组内对象
- .toHaveLength(number)：判断对象是否有length属性，并检查是否匹配
- .toBeInstanceOf(Class)：匹配实例是否通过class构造函数实例出来
- .toThrow(error?)/.toThrowError(error?)：匹配异常
- .toHaveBeenCalled()/.toBeCalled()：检查函数是否被执行
- .toHaveBeenCalledWith(arg1, arg2, ...)/.toBeCalledWith(arg1, arg2, ...)：检查调用函数传入值是否匹配
- .toHaveBeenLastCalledWith(arg1, arg2, ...)/.lastCalledWith(arg1, arg2, ...)：检查最后一次调用函数传入值是否匹配
- .toHaveBeenNthCalledWith(nthCall, arg1, arg2, ....)/.nthCalledWith(nthCall, arg1, arg2, ...)：检查第nth次调用函数传入值是否匹配
- .toHaveBeenCalledTimes(number)/.toBeCalledTimes(number)：检查函数被调用次数是否匹配
- .toHaveReturned()/.toReturn()：检查函数是否有返回值
- .toHaveReturnedTimes(number)/.toReturnTimes(number)：检查函数返回值得次数
- .toHaveReturnedWith(value)/.toReturnWith(value)：检查函数返回值是否匹配
- .toHaveLastReturnedWith(value)/.lastReturnedWith(value)：检查最后一次函数返回值是否匹配
- .toHaveNthReturnedWith(nthCall, value)/.nthReturnedWith(nthCall, value)：检查第nth次调用函数返回值是否匹配
- [expect api](https://www.jestjs.cn/docs/expect)

## 异步代码测试

js中的异步无非就是promise和async/await最常见

### Promises 规范 test return

```js
test('测试 fetchList 的返回值为 { code: 200 } using return', () => {
  return fetchList().then(res => {
    expect(res).toEqual({ code: 210 })
  })
})

test('测试 fetchList 的返回值包含 404', () => {
  return fetchList(false).catch(err => {
    expect.assertions(1)
    expect(err.toString()).toMatch('404')
  })
})
```

在测试成功返回值的时候，需要在`.then`里面执行测试用例，而且必须在开头加上return，返回整个异步代码，否则这个测试是没有意义的。

如果你忽略了这个return，你的测试将在异步函数返回的 `promise` 解析之前完成。

在测试失败返回值的时候，需要在`.catch`里面执行测试用例，但是这样做的话，如果请求发送成功，异步函数走进了`.then`回调，`.catch`里面的内容不会被执行，相当于这个测试用例没有做任何事情，还是照样能通过测试。

要解决这个问题，需要在前面加上`expect.assertions(1)`;，用来断言这个测试用例调用了一定数量的expect。如果调用次数不够，测试用例就不会通过。

### .resolves 匹配器 / .rejects 匹配器

```js
  test('测试 fetchList 的返回值为 { code: 200 } using resolve', () => {
    return expect(fetchList()).resolves.toEqual({ code: 200 })
  })

  test('测试 fetchList 的返回值包含 404 with reject', () => {
    // expect.assertions(1)
    return expect(fetchList(false)).rejects.toEqual(new Error('404'))
  })
```

### Async / Await

```ts
describe('test getOnePost ', () => {
  test('getOnePost success should be', async () => {
    const res = await getOnePost()
    expect(res.data).toEqual(post)
  })

  test('getOnePost fail should be', async () => {
    await expect(getOnePost()).rejects.toBe(400)
  })
})
```

### 钩子函数

beforeAll：在所有测试用例执行之前调用（调用一次）
afterAll：在所有测试用例执行之后调用（调用一次）
beforeEach：在每个测试用例执行之前调用（调用多次）
afterEach：在每个测试用例执行之后调用（调用多次）

#### 作用域

beforeAll和afterAll应用于文件中的每个测试用例。

还可以使用describe方法将测试用例进行分组。当它们位于describe中时，beforeAll和afterAll只应用于当前分组中的测试用例。

```ts
// index.test.js

describe("测试分组1", () => {
  beforeAll(() => {
    console.log("测试分组1 - beforeAll");
  });
  afterAll(() => {
    console.log("测试分组1 - afterAll");
  });
  test("测试", () => {
    console.log("测试分组1 测试");
    expect(1 + 1).toBe(2);
  });
});

describe("测试分组2", () => {
  beforeAll(() => {
    console.log("测试分组2 - beforeAll");
  });
  afterAll(() => {
    console.log("测试分组2 - afterAll");
  });
  test("测试", () => {
    console.log("测试分组2 测试");
    expect(1 + 1).toBe(2);
  });
});

```

每一个 describe 都可以有自己的钩子函数
每一个 describe 都有自己的作用域
每一个 钩子函数也有自己的作用域，就是当前所在的 describe
每一个 describe 里面的钩子函数对自己作用域下面所有的测试用例都生效
如果 describe 是多层嵌套的，那么测试用例执行的顺序是由外到内

### Mock

在单元测试中 ,我们一般对代码进行最小单元的测试 , 并不会关心模块/业务之间的耦合 , 所以我们会使用 mock 工具进行数据/方法的模拟实现 , 节约不必要的测试用例代码

Mock 函数提供的以下三种特性，在我们写测试代码时十分有用：

捕获函数调用情况
设置函数返回值
改变函数的内部实现

1. 测试函数是否被正常调用

```ts
// export function forEach<T>(items: T[], callback: (item: T) => void) {
//     for (let index = 0; index < items.length; index++) {
//         callback(items[index])
//     }
// }
import { forEach } from './fun'

describe('mock example', () => {
  const fn = jest.fn()
  test('callback be call', () => {
    forEach([1, 2, 3], fn)
    expect(fn).toBeCalled()
    expect(fn).toBeCalledTimes(3)
  })
})
```

mock 第三方库

### Using Jest mock functions in TypeScript

https://www.benmvp.com/blog/using-jest-mock-functions-typescript/


# Mock

jest对象上有`fn`,`mock`,`spyOn`三个方法，在实际项目的单元测试中，`jest.fn()`常被用来进行某些有回调函数的测试；jest.mock()可以mock整个模块中的方法，当某个模块已经被单元测试100%覆盖时，使用jest.mock()去mock该模块，节约测试时间和测试的冗余度是十分必要；当需要测试某些必须被完整执行的方法时，常常需要使用jest.spyOn()。

## jest.fn()
jest.fn()是创建 Mock 函数最简单的方式，如果没有定义函数内部的实现，jest.fn() 会返回 undefined 作为返回值。

```ts
test('测试jest.fn()调用', () => {
  const mockFn = jest.fn()
  const result = mockFn(1, 2, 3)

  // 断言mockFn的执行后返回undefined
  expect(result).toBeUndefined()
  // 断言mockFn被调用
  expect(mockFn).toBeCalled()
  // 断言mockFn被调用了一次
  expect(mockFn).toBeCalledTimes(1)
  // 断言mockFn传入的参数为1, 2, 3
  expect(mockFn).toHaveBeenCalledWith(1, 2, 3)
})

```
jest.fn()所创建的Mock函数还可以设置返回值，定义内部实现或返回Promise对象。

```ts
  test('测试jest.fn()返回固定值', () => {
    const mockFn = jest.fn().mockReturnValue('default')
    // 断言mockFn执行后返回值为default
    expect(mockFn()).toBe('default')
  })

  test('测试jest.fn()内部实现', () => {
    const mockFn = jest.fn((num1, num2) => {
      return num1 * num2
    })
    // 断言mockFn执行后返回100
    expect(mockFn(10, 10)).toBe(100)
  })

  test('测试jest.fn()返回Promise', async () => {
    const mockFn = jest.fn().mockResolvedValue('default')
    const result = await mockFn()
    // 断言mockFn通过await关键字执行后返回值为default
    expect(result).toBe('default')
    // 断言mockFn调用后返回的是Promise对象 ❌
    expect(Object.prototype.toString.call(mockFn())).toBe('[object Promise]')
    // 上面这个实际上返回的是String对象，返回Promise对象的写法要怎么做呢？
  })
```

## .mock属性

所有的 mock 函数都有一个特殊的 .mock 属性，它保存了关于此函数`如何被调用`、调用时的`返回值`的信息。



jest.spyOn()是jest.fn()的语法糖，它创建了一个和被spy的函数具有相同内部代码的mock函数。



- [Jest 实践指南](https://github.yanhaixiang.com/jest-tutorial/)