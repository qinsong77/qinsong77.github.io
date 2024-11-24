# Auth

## Authentication & Authorization

- Authentication: Verifies if the user is who they say they are. It requires the user to prove their identity with something they have, such as a username and password. 用户认证：验证用户的身份，确认用户是谁。一般使用账号密码实现。
- Authorization: Decides what routes and data the user can access. 用户授权：确定用户是否有权限执行某个操作，确定用户可以做什么。

## OAuth 2.0 协议及相关概念

在认证与授权方面，经常会提及的两个协议：OAuth 2.0 协议和OpenID connect 协议，其中OAuth 2.0定义了授权相关概念，OpenID connect 定义了认证相关概念。


### OAuth 2.0 协议和OpenID connect 协议

OAuth 2.0 在RFC6749的定义是：
> OAuth 2.0 框架能让第三方应用以有限的权限访问 HTTP 服务，可以通过构建资源 拥有者与 HTTP 服务间的许可交互机制，让第三方应用代表资源拥有者访问服务，或者 通过授予权限给第三方应用，让其代表自己访问服务。

OAuth 2.0 是一个授权协议，它允许软件代表资源拥有者去访问资源拥有者的资源。应用向资源拥有者请求授权，然后取得令牌(token)，并用它来访问资源。

![](./image/auth1.png)

OpenID Connect是一个位于OAuth 2.0框架之上的协议。它定义了一种使用 OAuth 2.0 执行用户身份认证的互通方式。

OAuth 2.0 协议通过`access token`提供授权，OpenID connect 协议引入了`id token`的概念，用作认证。

### Authorization Code Flow

OAuth 2.0 协议定义了多种授权方式，在这里主要说明的是Authorization Code这种方式。在详细描述授权方式之前，由几个基本概念需要了解。

- 资源所有者（resource owner）：资源所有者是能够授予对受保护资源的访问权限的实体。当资源所有者是一个人时，它被称为终端用户。

- 资源服务器（resource server）：托管受保护资源的服务器，能够接受和响应使用访问令牌（access token）对受保护资源的请求。

- 客户端（client）：是代表资源所有者访问受保护资源的软件。

- 授权服务器（authorization server）：服务器在成功认证资源所有者并获得授权后向客户端颁发访问令牌（access token）。

- Authorization Code授权方式分为两步，第一步客户端引导用户完成在授权服务器上的认证，获取到code，第二步客户端使用code在授权服务器获取到token。

![](./image/auth2.png)

- 客户端是需要在授权服务器预先注册的，注册成功之后客户端会得到授权服务器颁发的client id 和 client secret（要找个第三方当可靠的中间人，大家总要彼此认识认识吧）。

- ❶ 中发出的请求会携带参数client id和state，其中state是由客户端生成的随机字符串，会在❹中返回。客户端在发送❺的请求之前会校验state，这么做的原因是为了防止跨站攻击。

- ❷❸ 是资源所有者，一般是用户对来自授权服务器的请求进行授权。

- ❹ 客户端得到授权服务器返回的code和state。

- ❺ 客户端携带client id，client secret，code， response type，scope等参数向授权服务器发起请求。

- ❻ 授权服务器返回access token给客户端。

- ❼❽客户端携带access token向资源服务器发起对受保护资源的请求并得到响应。

### PKCE （Proof Key for Code Exchange）Flow
PKCE（Proof Key for Code Exchange）是增强版的Authorization Code授权方式，为了防止CSRF和授权码注入攻击。什么是授权码注入攻击？

假设在上图中❹返回的code被劫持，那么攻击方在预先获取客户端的client id 的情况下，可以模拟请求方发送请求给授权服务器获得token。

PKCE的引入就是为了防范这种攻击的。具体就是在上图中❶中引入额外的参数code verifier 和code challenge。code verifier 是客户端随机生成的字符串，在43-128位之间，由`[A-Z]` / `[a-z]` / `[0-9]` / "-" / "." / "_" / "~"组成。code challenge的计算公式是BASE64URL-ENCODE(SHA256(ASCII(code verifier)))，如果客户端不支持SHA256编码，那么code challenge的值就是code verifier。code challenge会被存储在授权服务器端，在❺中客户端会带上code verifier参数，授权服务器会把code verifier和存储的code challenge 在处理之后作比对，防止授权码的注入攻击。

### 集成OpenID connect做认证
如何集成OpenID connect到上述流程中做认证？

在上述的流程中，❺ 中请求的参数scope可以设置为openid,标识该请求希望获取授权服务器上的用户信息，那么在❻中返回的token集合除了包含access token， refresh token，还会包含id token。id token是OpenID connect 协议引入的，id token中包含了用户的信息。
