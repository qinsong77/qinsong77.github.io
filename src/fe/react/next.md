# Next.js

- [官网](https://nextjs.org/)
- [NextJS / React SSR: 21 Universal Data Fetching Patterns & Best Practices](https://wundergraph.com/blog/nextjs_and_react_ssr_21_universal_data_fetching_patterns_and_best_practices)

在 Next.js 中支持两种形式的预渲染(预渲染是指数据和 HTML 的拼接在服务器端提前完成。)

- 静态生成
- 服务器端渲染

### 静态生成

如果组件不需要在其他地方获取数据, 直接进行静态生成。

如果组件需要在其他地方获取数据, 在构建时 Next.js 会预先获取组件需要的数据, 然后再对组件进行静态生成。

`getStaticProps` 方法的作用是获取组件静态生成需要的数据. 并通过 `props` 的方式将数据传递给组件，该方法是一个异步函数, 需要在组件内部进行导出，在开发模式下, getStaticProps 改为在每个请求上运行。

`getStaticProps`这个方法是构建的时候运行的，也就是说他是运行在 node 上的，所以我们可以用 node 的语法编写，他也可以访问文件和数据库。

```jsx
import Head from 'next/head'
// 导出一个异步函数
export async function getStaticProps() {
  // 从文件系统，API，数据库中获取数据
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        a: 1
      })
    }, 3000)
  })
  // props属性的值将会传递给组件
  return {
    props: data // 返回的数据
  }
}

export default function List(props: any) {
  // props中获取到getStaticProps中返回的props
  return (
    <>
      <Head>
        <title>Index Page</title>
      </Head>
      <div>test</div>
      <div>{props.a}</div>
    </>
  )
}
```

### 服务端渲染

服务端渲染就是构建的时候不去生成 html，在页面请求的时候才去动态的生成 html 返回给浏览器器，这里需要用到`getServerSideProps`。

同样的写法如果采用服务器端渲染, 需要在组件中导出 `getServerSideProps` 方法。方法中的`context`会携带客户端请求带过来的参数。

```tsx
export async function getServerSideProps(context) {
  return {
    props: {
      data: context.query
    }
  }
}

export default function List(props) {
  // props中获取到getStaticProps中返回的props
  console.log(props)
  return (
    <>
      <Head>
        <title>Index Page</title>
      </Head>
      <div className={styles.demo}>test</div>
    </>
  )
}
```
