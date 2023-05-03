---
title: 
layout: BlogLayout
---

still work on this.

测试的最终目标是**提升代码信心** 。实现这个目标的关键要素是：**避免测试代码实现细节，要像真实用户那样去使用业务代码**。所以特别是在做集成测试的时候，切勿掉进代码的各种case里面，测试的用例更应该贴近用户的行为，
因为当你的用例越接近用户使用的样子，你从测试获得的代码的信心就越高。

>The more your tests resemble the way your software is used, the more confidence they can give you. - Kent C. Dodds

## redux

## React Router v6

## react hooks
当写公共library的自定义hooks，需要对hooks进行单元测试，使用这个[react-hooks-testing-library](https://react-hooks-testing-library.com/) 可以对hooks进行单独的测试，不用放在组件里，不然就会报错：

>Invariant Violation: Hooks can only be called inside the body of a function component.

对于`React 18`，`renderHook`这个Api已经可以在`react-testing-library` ([PR](https://github.com/testing-library/react-testing-library/pull/991)) 和 `react-native-testing-library` 导入使用了。

> 使用原则: ：当你的hook不与组件强相关，拥有独立含义时可以使用；当你的hook只被一个组件使用，且和它的定义强相关时，则不建议使用。


## i18next
