---
title: Summary of node
---

### Nest.js
> [中文网](https://docs.nestjs.cn/)

### v8
 - [认识 V8 引擎](https://zhuanlan.zhihu.com/p/27628685)
 - [V8引擎详解](https://juejin.cn/post/6844904137792962567)
 - [从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)
### [一篇文章构建你的 NodeJS 知识体系](https://juejin.cn/post/6844903767926636558)

- [MongoDB 极简入门实践](https://mp.weixin.qq.com/s/lcoa6X-aSaUJHzdXFEjuzA)

### [Cookie、Session、Token、JWT](https://juejin.im/post/6844904034181070861)

- [JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

简单token的组成： uid(用户唯一的身份标识)、time(当前时间的时间戳)、sign（签名，token 的前几位以哈希算法压缩成的一定长度的十六进制字符串）

JWT 的三个部分依次如下。
- Header（头部）
- Payload（负载）
- Signature（签名）

Token 和 JWT 的区别

相同：

- 都是访问资源的令牌
- 都可以记录用户的信息
- 都是使服务端无状态化
- 都是只有验证成功后，客户端才能访问服务端上受保护的资源
区别：

- Token：服务端验证客户端发送过来的 Token 时，还需要查询数据库获取用户信息，然后验证 Token 是否有效。
- JWT： 将 Token 和 Payload 加密后存储于客户端，服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）即可，不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。

两种Token：
1. 去中心化的JWT token

- 优点：
1. 去中心化，便于分布式系统使用
2. 基本信息可以直接放在token中。 username，nickname，role
3. 功能权限信息可以直接放在token中。用bit位表示用户所具有的功能权限。


- 缺点：服务端无法主动让token失效

2. 中心化的 redis token / memory session等
- 优点：服务端可以主动让token失效
- 缺点：每次都要进行redis查询。占用redis存储空间。


3. 优化方案：

3.1 Jwt Token中，增加TokenId字段。
3.2 将TokenId字段存储在redis中，用来让服务端可以主动控制token失效
3.3 牺牲了JWT去中心化的特点。
3.4 使用非对称加密。颁发token的认证服务器存储私钥：私钥生成签名。其他业务系统存储公钥：公钥验证签名。

方案2和3.2的区别：

方案2：redis存储的是token的**白名单**。用户的其他信息也要放在redis中存储。需要占用较大的redis空间和查询次数。

方案3.2 ：这里的redis只存储tokenId的黑名单，同时redis也可以分布式部署，读写分离。token认证服务器操作redis的master，其他redis同步master的数据

#### 基本知识点

- `__dirname`: 总是返回被执行的 js 所在文件夹的绝对路径;
- `__filename`: 总是返回被执行的 js 的绝对路径;
- `process.cwd()`: 总是返回运行 node 命令时所在的文件夹的绝对路径;
- `path.dirname()`： 返回 path 的目录名
- `path.join()`：所有给定的 path 片段连接到一起，然后规范化生成的路径
- `path.resolve()`：方法会将路径或路径片段的序列解析为绝对路径，解析为相对于当前目录的绝对路径，相当于cd命令
