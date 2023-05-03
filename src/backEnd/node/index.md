---
title: Summary
---

# Summary

## collection

### Nest.js

> [中文网](https://docs.nestjs.cn/)

### v8

- [认识 V8 引擎](https://zhuanlan.zhihu.com/p/27628685)
- [V8 引擎详解](https://juejin.cn/post/6844904137792962567)
- [从 Chrome 源码看 JS Object 的实现](https://zhuanlan.zhihu.com/p/26169639)

### [一篇文章构建你的 NodeJS 知识体系](https://juejin.cn/post/6844903767926636558)

- [Node.js 并发能力总结](https://mp.weixin.qq.com/s/6LsPMIHdIOw3KO6F2sgRXg)
- [MongoDB 极简入门实践](https://mp.weixin.qq.com/s/lcoa6X-aSaUJHzdXFEjuzA)

## [Cookie、Session、Token、JWT](https://juejin.im/post/6844904034181070861)

- [Cookie 详解](https://github.com/mqyqingfeng/Blog/issues/157)
- [前端登录介绍](https://juejin.cn/post/6845166891393089544)
- [JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

简单 token 的组成： uid(用户唯一的身份标识)、time(当前时间的时间戳)、sign（签名，token 的前几位以哈希算法压缩成的一定长度的十六进制字符串）

JWT 的三个部分依次如下：

- Header（头部）
- Payload（负载）
- Signature（签名）

`header` 部分指定了该 JWT 使用的签名算法:

```javascript
header = '{"alg":"HS256","typ":"JWT"}' // `HS256` 表示使用了 HMAC-SHA256 来生成签名。
```

`payload` 部分表明了 JWT 的意图：

```javascript
payload = '{"loggedInAs":"admin","iat":1422779638}' //iat 表示令牌生成的时间
```

`signature` 部分为 JWT 的签名，主要为了让 JWT 不能被随意篡改，签名的方法分为两个步骤：

1. 输入 `base64url` 编码的 header 部分、 `.` 、`base64url` 编码的 payload 部分，输出 `unsignedToken`。
2. 输入服务器端**私钥**、unsignedToken，输出 signature 签名。

```javascript
const base64Header = encodeBase64(header)
const base64Payload = encodeBase64(payload)
const unsignedToken = `${base64Header}.${base64Payload}`
const key = '服务器私钥'

signature = HMAC(key, unsignedToken)
```

最后的 Token 计算如下：

```javascript
const base64Header = encodeBase64(header)
const base64Payload = encodeBase64(payload)
const base64Signature = encodeBase64(signature)

token = `${base64Header}.${base64Payload}.${base64Signature}`
```

服务器在判断 Token 时：

```javascript
const [base64Header, base64Payload, base64Signature] = token.split('.')

const signature1 = decodeBase64(base64Signature)
const unsignedToken = `${base64Header}.${base64Payload}`
const signature2 = HMAC('服务器私钥', unsignedToken)

if (signature1 === signature2) {
  return '签名验证成功，token 没有被篡改'
}

const payload = decodeBase64(base64Payload)
if (new Date() - payload.iat < 'token 有效期') {
  return 'token 有效'
}
```

#### Token 和 JWT 的区别

##### 相同：

- 都是访问资源的令牌
- 都可以记录用户的信息
- 都是使服务端无状态化
- 都是只有验证成功后，客户端才能访问服务端上受保护的资源

##### 区别：

- Token：服务端验证客户端发送过来的 Token 时，还需要查询数据库获取用户信息，然后验证 Token 是否有效。
- JWT： 将 Token 和 Payload 加密后存储于客户端，服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）即可，不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。

### 两种 Token：

#### 1. 去中心化的 JWT token

- 优点：

1. 去中心化，便于分布式系统使用
2. 基本信息可以直接放在 token 中。 username，nickname，role
3. 功能权限信息可以直接放在 token 中。用 bit 位表示用户所具有的功能权限。

- 缺点：服务端无法主动让 token 失效

#### 2. 中心化的 redis token / memory session 等

- 优点：服务端可以主动让 token 失效
- 缺点：每次都要进行 redis 查询。占用 redis 存储空间。

#### 优化方案：

3.1 Jwt Token 中，增加 TokenId 字段。
3.2 将 TokenId 字段存储在 redis 中，用来让服务端可以主动控制 token 失效
3.3 牺牲了 JWT 去中心化的特点。
3.4 使用非对称加密。颁发 token 的认证服务器存储私钥：私钥生成签名。其他业务系统存储公钥：公钥验证签名。

方案 2 和 3.2 的区别：

方案 2：redis 存储的是 token 的**白名单**。用户的其他信息也要放在 redis 中存储。需要占用较大的 redis 空间和查询次数。

方案 3.2 ：这里的 redis 只存储 tokenId 的黑名单，同时 redis 也可以分布式部署，读写分离。token 认证服务器操作 redis 的 master，其他 redis 同步 master 的数据

## 基本知识点

- `__dirname`: 总是返回被执行的 js 所在文件夹的绝对路径;
- `__filename`: 总是返回被执行的 js 的绝对路径;
- `process.cwd()`: 总是返回运行 node 命令时所在的文件夹的绝对路径;
- `path.dirname()`： 返回 path 的目录名
- `path.join()`：所有给定的 path 片段连接到一起，然后规范化生成的路径
- `path.resolve()`：方法会将路径或路径片段的序列解析为绝对路径，解析为相对于当前目录的绝对路径，相当于 cd 命令
