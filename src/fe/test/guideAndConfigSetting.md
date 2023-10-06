

# 前端测试简介、React+Vite配置Jest

[[toc]]

## 引言

在前端工程化越来越完善的今天，一个标准完整的项目，通常情况单元测试是非常必要的，前端工程化大致分为模块化、组件化、规范化和自动化，测试我会认为在自动化环节。测试在敏捷开发中也是不可或缺的部分，比如在结对编程中，可以一人写测试，一人写实现代码，敏捷开发讲究TDD，也是重构环节的强力支持等。
在这里就不多讲比如前端为什么需要测试，能带来什么收益等了，理论上测试是项目中必不可少的一环，然而在国内却很少写，特别是前端，国内互联网往往追求产品和业务的快速上线和迭代，测试不可避免的被压缩和牺牲。个人觉得是否能把前端测试落地到
项目上，可能话语权根本不在前端开发，完全在于公司的开发文化、项目流程等。

## 测试类型

自动化测试可以帮助我们提高代码和功能的健壮程度，大幅减少可能出现的bug。日常开发通常涉及到**业务代码的开发**以及**函数**、**组件库**的开发。针对这几方面的自动化测试，在模式和流程上也有各自的要求与侧重。

这就衍生出了单元测试（Unit Test）、集成测试（Integration Test）、UI测试（UI Test）、端到端(e2e)测试/功能测四种主要的测试方法，以及**TDD**与**BDD**的测试开发流程。

> 前端测试主要分为4种：单元测试（Unit Test）、集成测试（Integration Test）、UI测试（UI Test）、端到端(e2e)测试/功能测试。

### 什么是单元测试

> 在计算机编程中，单元测试（英语：Unit Testing）又称为模块测试，是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。程序单元是应用的最小可测试部件。在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。——维基百科

所谓单元测试（unit testing），是指对软件中的最小可测试单元进行检查和验证。通俗地讲，在前端，单元可以理解为一个独立的模块文件，单元测试就是对这样一个模块文件的测试。

通常情况下，在公共函数/组件中一定要有单元测试来保证代码能够正常工作。单元测试也应该是项目中数量最多、覆盖率最高的。

能进行单元测试的函数/组件，一定是低耦合的，这也从一定程度上保证了我们的代码质量。`given-when-then`的结构，可以让你写出比较清晰的测试结构，既易于阅读，也易于编写。比如：

```ts
type TProduct = {
  name: string
  price: number
}
// production code
const computeTotalAmount = (products: TProduct[]) => {
  return products.reduce((total, product) => total + product.price, 0)
}

// testing code
it('should return summed up total amount 1000 when there are three products priced 200, 300, 500', () => {
  // given - 准备数据
  const products = [
    { name: 'nike', price: 200 },
    { name: 'adidas', price: 300 },
    { name: 'lining', price: 500 }
  ]

  // when - 调用被测函数
  const result = computeTotalAmount(products)

  // then - 断言结果
  expect(result).toBe(1000)
})
```

一个好的单元测试应该有以下特点：

- 只关注输入输出，不关注内部实现
- 只测一条分支
- 表达力极强
- 不包含逻辑
- 运行速度快

### 集成测试

所谓集成测试（Integration Testing），是指对软件中的所有模块按照设计要求进行组装为完整系统后，进行检查和验证。通俗地讲，在前端，集成测试可以理解为对多个模块实现的一个交互完整的交互流程进行测试。

集成测试通常被应用在：耦合度较高的函数/组件、经过二次封装的函数/组件、多个函数/组件组合而成的函数/组件等。

集成测试是安全感较高的测试，能很大程度提升开发者的信心，集成测试用例设计合理且测试都通过能够很大程度保证产品符合预期。

### UI 测试（UI Test）

就前端而言，UI 测试（UI Test）更贴近于我们的开发流程。在前后端分离的开发模式中，前端开发通常会使用到 Mock 的服务和数据。因而我们需要在开发基本完成后进行相应的 UI 测试（UI Test）。

主要是对图形交互界面的测试。UI层是用户使用产品的入口，所有功能通过这一层提供给用户。

举一个例子：现在你要对比，“特定页面的视觉样式”是否严格满足“设计师产出的视觉稿”，就涉及到了ui测试。一般会涉及到UI界面的快照(界面截图)对比等，所以快照测试是属于UI测试的一种

很多人认为，UI总是频繁的变动，导致测试用例维护成本高，性价比低，因此UI自动化测试比较适合场景稳定的业务。其实不是，这里的UI不仅仅指的是视觉，更多的是业务逻辑。UI可以多变，但业务逻辑一定是趋于稳定的，尤其是核心业务。

#### 快照测试

快照测试类似于“找茬”游戏。快照测试会给运行中的应用程序拍一张图片，并将其与以前保存的图片进行比较。如果图像不同，则测试失败。这种测试方法对确保应用程序代码变更后是否仍然可以正确渲染很有帮助。
当然，在前端中，其实并不是比较图片，而是比较前后生成的html结构，本质上是一个字符串的比较。
哪些场景会用到快照测试呢？典型的就是组件库中，例如：ant design，vant等其实每个组件都会有对应的快照测试。

##### 快照测试的弱点

快照本身不能验证渲染逻辑的正确性，它们只是擅长防止意外更改，检查渲染结果是否所需的元素、值及样式等等。

快照测试失败时，很容易通过 `Jest –updateSnapshot` 选项更新，而没有采取适当的措施验证是否需要更改。因此，需要某些开发人员纪律。

创建快照时，即使在渲染的输出实际上是错误的情况下，也被认为是正确的。

### 端到端测试E2E Test

E2E（end to end）端到端测试是最直观可以理解的测试类型。在前端应用程序中，端到端测试可以从用户的视角通过浏览器自动检查应用程序是否正常工作。 不关心代码内部的实现，只负责打开浏览器，把测试用例中设置的内容在页面上输入一遍，看是不是得到想要得到的结果。

一些流行的端到端测试框架：

- Cypress（推荐）
- Nightwatch
- WebdriverIO
- playwright

![](./images/e2e.webp)

[WebDriver](https://www.w3.org/TR/webdriver/) 是W3C标准中的浏览器远程控制协议（Protocol）

真实的测试环境，更容易获得程序的信心。

## 前端现代化测试模型

首先，简单对以上集中测试方法简单总结一下：

- 单元测试：从程序角度出发，对应用程序最小的部分（函数、组件）运行测试的过程，它是从程序员的角度编写的，保证一些方法执行特定的任务，给出特定输入，得到预期的结果。
- 集成测试：从用户角度出发，对应用中多个模块组织到一起的正确性进行测试。
- 快照测试：快照测试类似于“找不同”游戏，主要用于 UI 测试。
- 端到端测试：端到端测试是从用户的角度编写的，基于真实浏览器环境测试用户执行它所期望的工作。

### 前端测试在测什么？

**测试要对结果负责**

> 不要一味的只追求覆盖率，要衡量利弊后考虑整个测试方案

当需要对一个 web application 进行测试，从而增强对这个软件的信心的话，需要关心（测试）的同样至少有这三个方面：

- 页面有什么内容？
- 页面的内容长什么样子？
- 如果进行了某个交互，发生了什么行为（比如跟服务端进行了交互）？带来的影响是什么（比如内容和样式的变化）？
  当然这三个要素，可以在不同的场景下进行扩展。比如性能上的测试（首屏渲染，响应时间…），用户体验上的测试（动画，可用性…） 等等

前端测试中有两种模型, `金字塔模型`与`奖杯模型`。

### 测试金字塔

4种那到底该写哪种测试？都写，根据情况灵活分配。比较典型的就是： [金字塔模式](https://martinfowler.com/bliki/TestPyramid.html)

![](./images/pyramid_model2.png)

金字塔模型自下而上分为单元测试、集成测试、UI 测试, 之所以是金字塔结构是因为单元测试的成本最低, 与之相对, UI 测试的成本最高。所以单元测试写的数量最多, UI 测试写的数量最少。同时需注意的是越是上层的测试, 其通过率给开发者带来的信心是越大的。

**整个金字塔模型代表着越上层的测试集成度越高，执行速度越慢，越下层的测试隔离性越好，执行越快越轻量。**

都说业内最佳实践看Google，Google的自动化测试分层比例是：

- 单元测试（70%）
- 接口测试（20%）
- UI测试（10%）

#### UI测试 VS E2E测试

> UI测试（User Interface Test): 只是对于前端的测试，是脱离真实后端环境的，仅仅只是将前端放在真实环境中运行，而后端和数据都应该使用 Mock 的。

> E2E测试（End-to-end Test）：则是将整个应用放到真实的环境中运行，包括数据在内也是需要使用真实的。

测试金字塔的顶层（UI测试）并非这里字面意义上的"UI测试"，这一点比较有误导性，对于现代前端应用，UI测试侧重产品的UI交互是否正确，模拟后端进行测试也可以，放在单元测试里去做也可以。
而E2E测试，是需要模拟用户真实场景的测试，检查整个系统是否以正确的方式运作。 所以广义上的“UI测试”（测试金字塔的UI Tests）可以认为是E2E测试。

### 奖杯模式

奖杯模型摘自 Kent C. Dodds 提出的 [The Testing Trophy](https://twitter.com/kentcdodds/status/960723172591992832?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E960723172591992832&ref_url=https%3A%2F%2Fkentcdodds.com%2Fblog%2Fwrite-tests)，该模型是比较认可的前端现代化测试模型，模型示意图如下:

![](./images/champ_model.jpeg)

奖杯模型中自下而上分为静态测试、单元测试、集成测试、e2e 测试, 它们的职责大致如下：

- 静态测试：在编写代码逻辑阶段时进行报错提示。(代表库: ESLint、Flow、TypeScript)
- 单元测试：在奖杯模型中, 单元测试的职责是对一些边界情况或者特定的算法进行测试。(代表库: Jest、Mocha)
- 集成测试：模拟用户的行为进行测试，对网络请求、获取数据库的数据等依赖第三方环境的行为进行 Mock。（代表库: Jest、react-testing-library、Vue Testing Library 等）
- e2e 测试：模拟用户在真实环境上操作行为（包括网络请求、获取数据库数据等）的测试。（代表库: Cypress）

越是上层的测试给开发者带来的自信是越大的, 与此同时, 越是下层的测试测试的效率是越高的。奖杯模型综合考虑了这两点因素, 可以看到其在集成测试中的占比是最高的。

### 什么场景适合

下面是针对不同的应用场景为了一些个人建议:

- 如果你是开发纯函数库，建议写更多的单元测试 + 少量的集成测试
- 如果你是开发组件库，建议写更多的单元测试、为每个组件编写快照测试、写少量的集成测试 + 端到端测试
- 如果你是开发业务系统，建议写更多的集成测试、为工具类库、算法写单元测试、写少量的端到端测试

## 测试开发流程

### TDD

TDD，即Test-Driven Development（测试驱动开发），侧重点偏向开发，通过测试用例来规范约束开发者编写出质量更高、bug 更少的代码。简单的来说就是先编写测试代码，然后以使得所有测试代码都通过为目的，编写逻辑代码，是一种以测试来驱动开发过程的开发模式。

> 英语：Test-driven development，缩写为 **TDD** ）是一种[软件开发过程](https://zh.wikipedia.org/wiki/%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E8%BF%87%E7%A8%8B)中的应用方法，由[极限编程](https://zh.wikipedia.org/wiki/%E6%9E%81%E9%99%90%E7%BC%96%E7%A8%8B)中倡导，以其倡导先写测试程序，然后编码实现其功能得名。测试驱动开发始于 20 世纪 90 年代。测试驱动开发的目的是取得快速反馈并使用“illustrate the main line”方法来构建程序。——维基百科

TDD需要在测试的指导下写代码，关注点稍微偏重于测试。

使用单元测试结合测试驱动开发的流程，应该逐一梳理功能，编写的测试用例应聚焦在某个单元上。

针对功能点和组件各自的职责，先写测试代码，然后写业务代码，让业务最后通过测试，完成开发。

同时采用单元测试的方式，要保证所编写的测试用例，只针对组件本身的功能。

TDD由于是先写测试用例再进行开发，所以会保证每个功能的代码都是经过测试的，bug自然就少了很多。

同时在编写测试代码的时候，很自然地要去思考这个功能的代码如何组织，也在一定程度上提高了代码的可维护性。

在考虑 TDD 和自动化测试代码的时候，从来都不是要求和指标，而应该针对不同的情况去考虑利弊，回到 TDD 带来的三个好处：

- 厘清需求，确保代码足够满足需求并简单，并驱动出更好的封装和模块化设计（Simplify）
- TDD 带来的自动化测试代码，可以在编写代码带来错误时快速反馈(Fast Feedback)
- TDD 带来的自动化测试代码，减少反复手工测试带来的偏差（Repeatability）

因此，在实现测试代码甚至 TDD 的时候，需要考虑的重点就是：“测试带来的快速反馈有效吗？测试可以稳定的运行减少手工重复吗？”
同时，在这个过程中遇到困难的时候，可以思考：“在当前业务场景中，架构设计是不是不够合理，是不是需要进一步地封装得到更合理的模块化？”

### TDD 的三层含义

- Test-Driven Development，测试驱动开发
- Task-Driven Development，任务驱动开发，要对问题进行分析并进行任务分解
- Test-Driven Design，测试保护下的设计改善。TDD 并不能直接提高设计能力，它只是给你更多机会和保障去改善设计

### TDD 的流程

TDD 的基本流程

- 红：写一个失败的测试，它是对一个最小单位的需求描述，只关心输入输出，不考虑如何实现
- 绿：专注在用最快的方式实现当前这个小需求，不管其他需求，也不管代码质量如何
- 重构：既不用思考需求，也没有实现的压力，只需要找出代码中的坏味道，并用一个手法消除它，让代码变整洁

![](./images/tdd-process.png)

1. 创建一个失败的测试
2. 写出恰好能使测试通过的代码
3. 重构刚刚实现的代码
4. 重复前三步

下面的一张图可以清楚的明白编写单元测试的流程：
![img.png](./images/tdd-process2.png)

在我们现在的编码过程中是需要不断调试，不断试错，并且不能保证代码是简洁的。而“红-绿-重构”这种方式是先用脏乱代码表达出来，测试通过之后立刻重构刚写的代码，这是一个持续的循环过程，不能是写了很多实现代码后才开始重构，应该是随时重构你刚刚写出的代码，当你完成这个功能的时候，你的代码就是简洁可用的。

> 重构是改善代码结构的一种实践，但重构并不会改变由测试定义的行为。
>
> 重构不应该是单独拿出来花时间做的一件事情，也不应该出现在项目的计划中。重构应该是日常开发中时时刻刻都在进行的活动，它就是开发活动中不可分割的一部分。
>
> 重构应该是在**不破坏任何测试**的前提下对命名、类、函数和表达式进行修改。在不影响行为逻辑的情况下**改善**系统的结构。

通过以上，我们可以看出**重构**是需要 **完备的测试做安全网** ，就是这层安全网给了我们重构的信心和勇气。

### 简单设计原则

![](./images/simple-test-principle.jpeg)

优先级从上至下降低

- 通过测试-最简单的方式让测试通过
- 揭示意图-表明代码意图
- 消除重复-去除重复代码
- 最少元素-使用最少的代码完成这个功能

### 测试条件格式

在我们编写测试用例的时候通常遵循以下形式：

- Given-给定上下文
- When-条件、行为，触发一个动作或者事件
- Then-对期望结果的验证

### 传统编码方式 对比 TDD 编码方式

#### **传统编码方式**

需求分析 -> 确认需求细节 -> 开发 -> 调试 -> (加需求 -> 开发 -> 调试) ->

QA 测试 -> 提出 bug -> 改 bug、打补丁 -> QA 测试 -> 完成

最终的代码冗余、逻辑混乱，稍微动一下，就可能有未知的错误出现，改了之后还要 QA 测试，然后加班继续改…

#### **TDD 编码方式**

1. 先分解任务-分离关注点
2. 列 Example-用实例化需求，澄清需求细节
3. 写测试-只关注需求，程序的输入输出，不关心中间过程
4. 写实现-不考虑别的需求，用最简单的方式满足当前这个小需求即可
5. 重构-用手法消除代码里的坏味道
6. 重复 3、4、5 步骤
7. 写完功能-手动测试一下，基本没什么问题，有问题补个用例，修复
8. 转测试-小问题，补用例，修复
9. 代码整洁且用例齐全，信心满满地交付代码

#### 总结

从上面两个流程不难看出，测试驱动开发最大的优点就是**重构**了，不断迭代，不断地对现有代码进行重构，不断优化代码的内部结构，最终实现对整体代码的改进。以此不断减少一些设计冗余、代码冗余、逻辑复杂度等等。

缺点就是存在 **局限性** ，它不能发现集成错误、性能问题、或者其他系统级别的问题。还要求一定是 **好的测试用例** ，如果测试代码太复杂，那么测试代码本身就可能有 bug。

### BDD

BDD, 即Behavior Driven Development(行为驱动开发)，简单的来说就是先编写业务逻辑代码，然后以使得所有业务逻辑按照预期结果执行为目的，编写测试代码，是一种以用户行为来驱动开发过程的开发模式。

BDD实际上是模拟用户的行为，在业务代码完成后，用测试用例模拟用户的操作行为，由于关注点上升到了整个系统的层面，所以使用集成测试，应该忽略组件个体的行为，保证系统行为的流畅。

由于是先完成业务代码，再做测试。

通过上面这个demo可以明白集成测试相对于单元测试，更多侧重多组件的协同，假如一个组件本身没有问题，但与其他组件配合的时候出问题了，那整个流程是不会通过测试的。

再结合BDD，使开发时更加关注业务代码，不必先写繁琐的测试用例。而且只要操作流程不会变，那测试用例也基本不用动，更加适合平时业务的开发。

### 测试原则

1. 从真实用户的行为流程去测试，往往比测函数本身，能给你带来更多的信心。
2. 对于没有独立性和通用性的函数或对象，把它们视作实现的一部分，一般没有必要为它们去写单独的测试。不要拘泥于对“单元测试”的字面理解，不要被形式上的规律所束缚。
3. 不要把测试覆盖率视为太过重要的指标，它的目的还是帮助提升代码的稳定。有的代码没有覆盖也没关系，有的代码值得你覆盖好多遍。毕竟，我们不是为了写测试而写测试。

## React项目如何配置Jest和RTL

通过 [`create-react-app`](https://create-react-app.dev/) 创建的项目以及默认配置好`Jest`和`RTL`(React Test Library)，开箱即用，能基本满足绝大多数需求，CRA涉及的依赖包有：

- `babel`，包括`babel-jest`, `@babel/core`, `@babel/preset-env`，使用babel肯定是为了转译，比如nodejs 采用的是 CommonJS 的模块化规范，使用 require 引入模块；而 import 是 ES6 的模块化规范关键字。为了能使用这些新特性，就需要使用 babel 把 ES6 转成 ES5 语法。
- `jest`,`jest-resolve`,`jest-watch-typeahead`(jest watch的时候使用这个根据文件名或者测试名称去筛选)
- RTL: `@testing-library/jest-dom`、`@testing-library/react`、`@testing-library/user-event`

可以通过`npm run eject`看到相关完整的配置和脚本等。

接下来将通过使用`pnpm create vite vite-react-test-guide -- --template react-ts`，创建基于[vite](https://cn.vitejs.dev/guide/) 构建构建工具的base项目展示如何配置的，比较简单，大部分是配置jest的，可先参考官网的[getting started](https://jestjs.io/docs/getting-started),

### 安装依赖

首先需要安装所需要的依赖

```shell
pnpm install jest @types/jest -D

## babel是可选的转译器之一 or ts-jest
pnpm install babel-jest @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript -D
# or
pnpm i ts-jest -D

pnpm install @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/testing-library__jest-dom -D
pnpm install identity-obj-proxy -D
pmpm install eslint-plugin-jest -D
```

### babel?

我们都知道babel其实就是个编译器，`Jest` 目前支持的是 `cjs` 规范，本质上也是因为如上提到的node也是

比如在未做任何配置的情况下创建如下简单的测试

```js
// sum.js
// function sum(a, b) {
//   return a + b
// }
//
// module.exports = sum

export function sum(a, b) {
  return a + b
}
```

测试脚本

```js
// sum.test.js
// const sum = require('./sum')
//
// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3)
// })

import { sum } from './sum'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

如图所示，使用`cjs`不会报错，而使用`esm`就不支持。其实node在13.2.0 版本就正式支持`esm`了，所以如果想直接支持`esm`, 可参考[官方文档](https://jestjs.io/docs/ecmascript-modules) 。目前都是实验性质的开启，这里不再尝试和深究了。

![](./images/jest_babel.png)

当然除了以上，比如要支持`typescript`也是使用的`@babel/preset-typescript`去做的，需要注意的是，`@babel/preset-typescript` 只做语法转换，不做类型检查，因为类型检查的任务可以交给 `tsc` （或者用 `IDE`）去做，或者使用[ts-jest](https://jestjs.io/docs/next/getting-started#via-ts-jest) 去做。

`Jest` 运行时内部先执行`babel-jest`, 检测是否安装 `babel-core`，然后取 `.babelrc`(或者`babel.config.js`/`package.json`) 中的配置，运行测试之前结合 `babel` 先把测试用例代码转换一遍然后再进行测试。

可以预见到，为了`jest`会不依赖与`babel\babel-jest`，包括现在就在做实验性质的尝试，官网就提到过[`Once V8 coverage and native ESM support stabilizes in Jest, we will also be able remove babel-jest as a default but we will keep maintaining it.`](https://jestjs.io/blog/2020/05/05/jest-26)
总之就等node.js ESM特效稳定咯, [v28也不行](https://jestjs.io/blog/2022/04/25/jest-28#ecmascript-modules)

配置文件，babel.config.js

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      // https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic'
      }
    ]
  ]
}
```

> 在vite下使用Jest, 应该可以考虑不要babel，比如用[`esbuild-jest`](https://www.npmjs.com/package/esbuild-jest) 去transform file，毕竟vite也是基于esbuild的，这个后面尝试下

#### 为什么CRA创建的ts模版项目package.json没有`@babel/preset-react @babel/preset-typescript`

被集成到`babel-preset-react-app`包的dependencies中了，这个包就是包含`Babel preset`的，只是一个合集，在cra项目的package.json中可以看到如下配置

```json
{
  "babel": {
    "presets": ["react-app"]
  }
}
```

### 使用[ts-jest](https://kulshekhar.github.io/ts-jest/docs/) 代替`babel`

以上用`babel`搭建测试环境，但项目本身是基于vite + typescript的，使用`babel`太过冗余，且还不支持类型检查，于是使用`ts-jest`代替。

首先移除相关依赖和`babel`配置

```shell
pnpm remove babel-jest @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-transform-react-jsx -D
pnpm i ts-jest -D
```

:::warning
注意，这里 ts-jest 一定要和 jest 的大版本一致！ 比如 27 对 27，或者 26 对 26，否则会有兼容问题！
:::

当然还得安装typescript + tsconfig.json 的设置，创建的模版项目已配置好，但需新增如下配置：

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "@testing-library/jest-dom"]
  }
}
```

这样TS 就能找到如`describe` 和 `it` 的类型定义。

并且需要在jest.config.ts中修改如下：

```ts
export default {
  transform: {
    // '\\.[jt]sx?$': 'babel-jest',
    '\\.[jt]sx?$': 'ts-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/fileTransformer.js'
  }
}
```

或者如下配置jest.config.ts:

```ts
// https://stackoverflow.com/questions/66465339/how-to-make-ts-jest-work-with-import-export-syntax-of-the-js-files-that-are-bein
export default {
  globals: {
    extensionsToTreatAsEsm: ['.ts', '.js'],
    'ts-jest': {
      useESM: true
    }
  },

  preset: 'ts-jest/presets/js-with-ts-esm',

  // from https://stackoverflow.com/a/57916712/15076557
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-to-be-transformed)/)'
  ]
}
```

### 配置文件

首先需要添加测试脚本命令

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

#### jest.config.js

可通过`jest --init`生成粗略的配置.

```js
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  // 是否显示覆盖率报告
  collectCoverage: true
}
```

下面是cra中的配置，放在了package.json中

::: details 点击查看代码

```json
{
  "jest": {
    "roots": ["<rootDir>/src"],
    "collectCoverageFrom": ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
    "setupFiles": ["react-app-polyfill/jsdom"],
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jsdom",
    "transform": {
      "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/config/jest/babelTransform.js",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    "modulePaths": [],
    "moduleNameMapper": {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    "moduleFileExtensions": [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    "watchPlugins": [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ],
    "resetMocks": true
  }
}
```

:::

#### [identity-obj-proxy](https://www.npmjs.com/package/identity-obj-proxy) 是个什么鬼？

在jest配置中，会有如下的配置：

```js
module.exports = {
  // ...
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  // in cra
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  }
}
```

关于该配置字段的[描述文档](https://jestjs.io/docs/next/configuration#modulenamemapper-objectstring-string--arraystring) 如下所述：

> A map from regular expressions to module names that allow to stub out resources, like images or styles with a single module.

就是用来 [stub](https://stackoverflow.com/questions/4029313/what-is-a-stub-routine) 一些资源文件或 `module `使用的，可以把匹配到的内容映射为你指定的内容，哪怕是“指鹿为马”也是行得通的！在前端的单元测试中，时常有许多内容是不需要的，比如：静态资源、样式文件等。那么这个时候就可以将这些“鹿”指成“马”了。

而[`identity-obj-proxy`](https://github.com/keyz/identity-obj-proxy#readme) 就是用来干这个事情的

#### [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)?

解决eslint关于jest的报错，比如`ESLint: 'test' is not defined.(no-undef)`之类的，因为Jest的Api是全局不需要`import`的。

额外的还可以补全eslint的测试插件：

```shell
pnpm i eslint-plugin-jest-dom eslint-plugin-testing-library
```

如何配置可以参考安装后package的`README.md`文件

#### setupFiles/setupFilesAfterEnv

很多人都知道 Jest 的 `setupFiles`，但不太了解 [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfiles-array),

![](./images/setupFiles-vs-setupFilesAfterEnv.png)

简单来说：

- `setupFiles` 是在 **引入测试环境（比如下面的 `jsdom`）之后** 执行的代码
- `setupFilesAfterEnv` 则是在 **安装测试框架之后** 执行的代码

具体应用场景是：在 `setupFiles` 可以添加 **测试环境** 的补充，比如 Mock 全局变量 `abcd` 等。而在 `setupFilesAfterEnv` 可以引入和配置 **Jest/Jasmine（Jest 内部使用了 Jasmine）** 插件。

如果试图在 `setupFiles` 添加 Jest 的扩展/插件，那么你可能会得到 `expect is not defined` 报错。[详见这个 Issue](https://github.com/testing-library/jest-dom/issues/122#issuecomment-650520461) 。

一般用setupFiles设置`.env`环境变量，使用setupFilesAfterEnv设置jest的配置比如`jest.setTimeout(70000)`

jest.config.js

```js
export default {
  setupFiles: ['<rootDir>/tests/settings/env-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/testSetupFile.js']
}
```

env-setup.ts

```js
import dotenv from 'dotenv'
import path from 'path'

console.log(`============ env-setup Loaded ===========`)
dotenv.config({
  path: path.resolve(process.cwd(), 'tests', 'settings', '.test.env')
})
```

testSetupFile.ts

```js
// Some of the `jest` tests are very slow and cause
// timeouts on bitbucket pipeline
console.log(`============ testSetupFile Loaded ===========`)
jest.setTimeout(70000)
```

在根目录src新建 `setupTests.ts`

```js
import '@testing-library/jest-dom'
```

一次引用，不要再次import

#### jsdom 测试环境

`jest` 提供了 `testEnvironment` 配置：

```js
module.exports = {
  testEnvironment: 'jsdom'
}
```

添加 `jsdom` 测试环境后，全局会自动拥有完整的浏览器标准 API。**原理是使用了 [jsdom](https://github.com/jsdom/jsdom) 。
这个库用 JS 实现了一套 Node.js 环境下的 Web 标准 API。** 由于 Jest 的测试文件也是 Node.js 环境下执行的，所以 Jest 用这个库充当了浏览器环境的 Mock 实现。

### 路径简写

路径简写即path alias, 比如`../../src/utils/sum` 这么长的路径简写成 `utils/sum`， 这也是很多大型项目的必备配置了 —— **路径简写/别名**。

要实现这样的效果，可以在 `moduleDirectories` 添加 `"src"`：

```js
// jest.config.js
module.exports = {
  moduleDirectories: ['node_modules', 'src']
  // ...
}
```

这样一来 `jest` 就能看懂 `utils/sum` 对应的是 `../../src/utils/sum`，但是，`tsc` 又看不懂，所以还得在 `tsconfig.json` 里指定 `paths` 路径：

```json
{
  "compilerOptions": {
    "paths": {
      "utils/*": ["src/utils/*"]
    }
  }
}
```

解释一下， **所谓的 “路径简写” 本质上只是路径映射。所以 `tsconfig.json` 里的 `paths` 就是把 `utils/xxx` 映射成 `src/utils/xxx`，
而 `jest.config.js` 里的 `moduleDirectories` 则稍微狠一点，直接把 `utils/sum` 当作第三方模块，先在 `node_modules` 里找，找不到再从 `src/xxx` 下去找。
所以这两者是有区别的。**

一般可能不会这么写，而是用别名作为路径开头：`import sum from "@/utils/sum"`。这依旧是路径匹配，`tsconfig.json` 的配置相当简单：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

但对 Jest 的配置就不能再用 `moduleDirectories` 了，也得用路径匹配。我们可以使用 `moduleNameMapper`，这也是使用频率非常高的一个配置项：

```js
// jest.config.js
modulex.exports = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
```

可是难道每次写路径匹配规则都在 `tsconfig.json` 和 `jest.config.js` 写两份么？**很遗憾，确实如此。造成这个问题的主要原因是 `jest` 根本不管 `tsc`。**
不过，好消息是，可以用 `ts-jest` 里的工具函数 `pathsToModuleNameMapper` 来把 `tsconfig.json` 里的 `paths` 配置复制到 `jest.config.js` 里的 `moduleNameMapper`：

```js
// jest.config.js
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')
module.exports = {
  // [...]
  // { prefix: '<rootDir/>' }
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
}
```

看到这样的配置方法，你是不是觉得 JS 的单一原则太难顶了？这么简单的一个功能都要通过第三方的 `ts-jest` 来提供？然而，坏消息是 `webpack` 的配置也不会读 `tsconfig.json` 里面的 `paths`，
**所以，开发者不仅要在 `tsconfig.json` 里写一份路径映射，还要在 `webpack.config.js` 里再写一份** 。[详见这里](https://stackoverflow.com/questions/40443806/webpack-resolve-alias-does-not-work-with-typescript) 。

### 生成测试覆盖率报告

什么是单元测试覆盖率？

单元测试覆盖率是一种软件测试的度量指标，指在所有功能代码中，完成了单元测试的代码所占的比例。有很多自动化测试框架工具可以提供这一统计数据，其中最基础的计算方式为：

```txt
单元测试覆盖率 = 被测代码行数 / 参测代码总行数 * 100%
```

如何生成？

加入 jest.config.js 文件

```js
module.exports = {
  // 是否显示覆盖率报告
  collectCoverage: true,
  // 告诉 Jest 哪些文件需要经过单元测试测试
  collectCoverageFrom: ['src']
}
```

![](./images/test_result.png)

参数解读

| 参数名   | 含义       | 说明                           |
| -------- | ---------- | ------------------------------ |
| % stmts  | 语句覆盖率 | 是不是每个语句都执行了？       |
| % Branch | 分支覆盖率 | 是不是每个 if 代码块都执行了？ |
| % Funcs  | 函数覆盖率 | 是不是每个函数都调用了？       |
| % Lines  | 行覆盖率   | 是不是每一行都执行了？         |

上面终端里展示的就是覆盖率情况，只不过以终端的形式展示。现在我们打开根目录下的 `coverage` 目录，会发现生成很多覆盖率文件：

```
├── clover.xml             # Clover XML 格式的覆盖率报告
├── coverage-final.json    # JSON 格式的覆盖率报告
├── lcov-report            # HTML 格式的覆盖率报告
│   ├── base.css
│   ├── block-navigation.js
│   ├── favicon.png
│   ├── index.html         # 覆盖率根文件
│   ├── prettify.css
│   ├── prettify.js
│   ├── sort-arrow-sprite.png
│   ├── sorter.js
│   └── sum.js.html        # sum.js 的覆盖率情况
└── lcov.info
```

Jest 会在 `coverage` 目录下生成各种不同格式的覆盖率报告文件，有 `XML`，`JSON`，也有 `HTML` 的。生成这么多不同格式的测试报告只只是为了方便不同工具的读取，
比如 JS 读 JSON 就比读 XML 容易，它们描述的内容都是一样的。

无论哪种格式，都很难直观地看懂。因此，Jest 也支持生成网页的测试报告，打开 `lcov-report/index.html` 就可以看到网页版的测试报告了.

#### 测试报告细则

如：
![](./images/coverage_html.png)

![](./images/coverage_with_I.png)
在测试文件中：

- `E`代表代码`else`分支没有cover ('E' stands for 'else path not taken', which means that for the marked if/else statement, the 'if' path has been tested but not the 'else'.)
- `I`代表代码`if`分支没有cover ('I' stands for 'if path not taken', which is the opposite case: the 'if' hasn't been tested.)
- 左侧每行的`xN`代表执行的次数(The xN in left column is the amount of times that line has been executed).
- 没有执行的行**红色**高亮（Not executed lines, or pieces of code, will be highlighted in red）.

It also provides some color codes -

- Pink: statements not covered.（粉色声明没有cover）

- Orange: functions not covered.（橘色function没有cover）

- Yellow: branches not covered.（黄色分支没有cover）

### 报错

1. ![](./images/jest-env-dom-error.png)

v28版本更新导致，见[文档](https://jestjs.io/blog/2022/04/25/jest-28#breaking-changes)

安装`pnpm i jest-environment-jsdom -D` 解决

2. svg资源导致 `Jest encountered an unexpected token`

jest配置添加如下，如[Code Transformation](https://jestjs.io/docs/next/code-transformation)

```js
export default {
  // ...
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/fileTransformer.js'
  }
  // ...
}
```

3. path alias

设置文件路径别名时，工程上时[resolve.alias](https://cn.vitejs.dev/config/#resolve-alias) + [typescript path alias](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) ，在跑测试时会找不到对应的模块，
需要在`jest.config.js`中配置`moduleNameMapper`，类似如下

```js
export default {
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@api': '<rootDir>/src/api/index.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

## Reference

- [jest](https://jestjs.io/docs/getting-started)
- [write-tests](https://kentcdodds.com/blog/write-tests)
- [深度解读 - TDD（测试驱动开发）](https://www.jianshu.com/p/62f16cd4fef3)
- [前端单元测试](https://ths.js.org/2021/04/06/%E5%89%8D%E7%AB%AF%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/)
- [React单元测试策略及落地](https://insights.thoughtworks.cn/react-strategies-for-unit-testing/)
- [前端测试的反模式](https://insights.thoughtworks.cn/front-end-testing/)
- [重构：干掉有坏味道的代码](https://www.cnblogs.com/xybaby/p/12894470.html)
- [How to read Test Coverage report generated using Jest.](https://krishankantsinghal.medium.com/how-to-read-test-coverage-report-generated-using-jest-c2d1cb70da8b)
