---
title: TypeScript with React
---

- [TypeScript with React](https://github.com/typescript-cheatsheets/react)
- [优雅地在 React 中使用TypeScript](https://mp.weixin.qq.com/s/qQScmqkiZkyDWxjJU34nOw)

### 泛型组件

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
