---
title: TypeScript with React
---

- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)
- [https://mp.weixin.qq.com/s/qQScmqkiZkyDWxjJU34nOw](https://mp.weixin.qq.com/s/qQScmqkiZkyDWxjJU34nOw)

##### 泛型组件

```tsx
interface TableProps<Row> {
  header: [];
  data: readonly Row[];
}
const Table = <Row extends Record<string, unknown>>(props: TableProps<Row>) => {
  return <table></table>;
};

const Table2 = <Row,>(props: TableProps<Row>) => {
  return <table></table>;
};
const Table3: <Row extends Record<string, unknown>>(
  props: TableProps<Row>
) => React.Element = ({ data, header }) => {
  return <table></table>;
};

function Table4<T>(props: TableProps<T>) {
  return <table></table>;
}
```

> TypeScript 中的箭头函数定义范型必须使用 extends 关键字，因为它们是函数表达式，而不是函数声明，因此必须使用 extends 关键字来指定函数的返回类型。使用 extends 关键字可以确保函数的返回类型与范型类型参数的类型相匹配，从而确保函数的正确性。
