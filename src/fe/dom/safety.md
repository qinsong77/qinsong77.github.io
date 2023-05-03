---
title: 安全
---

# 安全
- [XSS](#xss)
  - [如何攻击](#%E5%A6%82%E4%BD%95%E6%94%BB%E5%87%BB)
  - [如何防御](#%E5%A6%82%E4%BD%95%E9%98%B2%E5%BE%A1)
  - [CSP](#csp)
- [CSRF](#csrf)
  - [如何攻击](#%E5%A6%82%E4%BD%95%E6%94%BB%E5%87%BB-1)
  - [如何防御](#%E5%A6%82%E4%BD%95%E9%98%B2%E5%BE%A1-1)
    - [SameSite](#samesite)
    - [验证 Referer](#%E9%AA%8C%E8%AF%81-referer)
    - [Token](#token)
- [密码安全](#%E5%AF%86%E7%A0%81%E5%AE%89%E5%85%A8)
  - [加盐](#%E5%8A%A0%E7%9B%90)
  - [对称加密和非对称加密](#对称加密和非对称加密)

- [想进大厂必须要知道的Web安全问题](https://juejin.im/post/6844904100945985543)
- [你在项目中做过哪些安全防范措施？](https://mp.weixin.qq.com/s/s1doq884nreQPwbvqopL0g)
## XSS

> **跨网站指令码**（英语：Cross-site scripting，通常简称为：XSS）是一种网站应用程式的安全漏洞攻击，是[代码注入](https://www.wikiwand.com/zh-hans/%E4%BB%A3%E7%A2%BC%E6%B3%A8%E5%85%A5)的一种。它允许恶意使用者将程式码注入到网页上，其他使用者在浏览网页时就会受到影响。这类攻击通常包含了 HTML 以及使用者端脚本语言。

简单点说就是：黑客利用网站的漏洞注入恶意代码，用户访问网站的时候，恶意代码就会在用户浏览器上运行。

恶意代码在用户浏览器上执行虽然不能访问用户的操作系统，但，可以窃取用户敏感数据，或是引导到非正规网站，或是修改页面DOM等等。

由于XSS攻击样式较多，通常可以分为三种：
- 存储型XSS。这种攻击脚本会存储在目标网站中，我们的网站的维护人员，可以查到这些数据。
- 反射型XSS。这种攻击代码是由用户不知觉的情况下携带了XSS脚本访问目标网站。这种攻击脚本不会存储在网站端。
- 基于DOM的XSS。多是利用页面的动态渲染来进行攻击

### 如何攻击

XSS 通过修改 HTML 节点或者执行 JS 代码来攻击网站。

例如通过 URL 获取某些参数

```html
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>                                                  
```

上述 URL 输入可能会将 HTML 改为 `<div><script>alert(1)</script></div>` ，这样页面中就凭空多了一段可执行脚本。这种攻击类型是反射型攻击，也可以说是 DOM-based 攻击。

也有另一种场景，比如写了一篇包含攻击代码 `<script>alert(1)</script>` 的文章，那么可能浏览文章的用户都会被攻击到。这种攻击类型是存储型攻击，也可以说是 DOM-based 攻击，并且这种攻击打击面更广。

### 如何防御
检查用户输入 & 转义不可信的输出 & 设置 CSP `script-src`(参考下面CSP)。

最普遍的做法是转义输入输出的内容，对于引号，尖括号，斜杠进行转义

```js
function escape(str) {
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/"/g, "&quto;");
	str = str.replace(/'/g, "&#39;");
	str = str.replace(/`/g, "&#96;");
    str = str.replace(/\//g, "&#x2F;");
    return str
}
```

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>')
```

对于显示富文本来说，不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。这种情况通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

```js
var xss = require("xss");
var html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>');
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html);
```

以上示例使用了 `js-xss` 来实现。可以看到在输出中保留了 `h1` 标签且过滤了 `script` 标签

### CSP

> 内容安全策略   ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

我们可以通过 CSP 来尽量减少 XSS 攻击。CSP 本质上也是建立白名单，规定了浏览器只能够执行特定来源的代码。

通常可以通过 HTTP Header 中的 `Content-Security-Policy` 来开启 CSP

- 只允许加载本站资源

  ```http
  Content-Security-Policy: default-src ‘self’
  ```

- 只允许加载 HTTPS 协议图片

  ```http
  Content-Security-Policy: img-src https://*
  ```

- 允许加载任何来源框架

  ```http
  Content-Security-Policy: child-src 'none'
  ```
- 只允许执行source的脚本，转义不可信的输出，防范XSS攻击

  ```http
  Content-Security-Policy: script-src <source>
  ```
  这个含义是告诉浏览器当前网站只允许`<source>`下的脚本执行。这样无论黑客怎么嵌入脚本，只要在正规浏览器中访问网站，嵌入脚本都不会执行。

更多属性可以查看 [这里](https://content-security-policy.com/)

## CSRF

> **跨站请求伪造**（英语：Cross-site request forgery），也被称为 **one-click attack** 或者 **session riding**，通常缩写为 **CSRF** 或者 **XSRF**， 是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。[1](https://www.wikiwand.com/zh/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0#citenoteRistic1) 跟[xss](https://www.wikiwand.com/zh/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC)相比，
> **XSS** 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

简单点说，黑客利用用户在浏览器中已经存在的目标网站cookie，对目标网站发起请求。而这个请求的过程，往往是黑客诱导用户，在不知情的情况下进行的。

![](./image/csrf.png)

### 如何攻击

假设网站中有一个通过 Get 请求提交用户评论的接口，那么攻击者就可以在钓鱼网站中加入一个图片，图片的地址就是评论接口

```html
<img src="http://www.domain.com/xxx?comment='attack'"/>
```

 如果接口是 Post 提交的，就相对麻烦点，需要用表单来提交接口

```html
<form action="http://www.domain.com/xxx" id="CSRF" method="post">
    <input name="comment" value="attack" type="hidden">
</form>
```

### 如何防御

防范 CSRF 可以遵循以下几种规则：

1. Get 请求不对数据进行修改
2. 不让第三方网站访问到用户 `Cookie`
3. 阻止第三方网站请求接口
4. 请求时附带验证信息，比如验证码或者 token
5. 检查 `Referer` 字段
6. Axios CSRF 防御, 双重 Cookie 防御 的方案来防御 CSRF 攻击
```javascript
// lib/defaults.js
var defaults = {
  adapter: getDefaultAdapter(),
  // 省略部分代码
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
};

// lib/adapters/xhr.js
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestHeaders = config.headers;
    
    var request = new XMLHttpRequest();
    // 省略部分代码
    
    // 添加xsrf头部
    if (utils.isStandardBrowserEnv()) {
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    request.send(requestData);
  });
};
```
### [SameSite](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

可以对 Cookie 设置 `SameSite` 属性。该属性设置 Cookie 不随着跨域请求发送，该属性可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容。
`SameSite`可以设置为三个值，`Strict`、`Lax`和`None`。

1. 在`Strict`模式下，浏览器完全禁止第三方请求携带`Cookie`。比如请求`sysuke.com`网站只能在`sysuke.com`域名当中请求才能携带 Cookie，在其他网站请求都不能。
2. 在`Lax`模式，就宽松一点了，但是只能在 `get 方法提交表单`或者`a 标签发送 get 请求`的情况下可以携带 Cookie，其他情况均不能。
3. 在`None`模式下，Cookie将在所有上下文中发送，即允许跨域发送。



### 验证 Referer

对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的。

### Token

服务器下发一个随机 Token（算法不能复杂），每次发起请求时将 Token 携带上，服务器验证 Token 是否有效。

### 总结
防范思路大致为两种：
1. 确认接收到的请求是合法的 
2. 确认接收到的请求来自合法的客户端

#### 确认接收到的请求是合法的

简单来说就是确认请求的前置步骤的确是由自己网站生成的，不是由其他网站发出的。 方法：使用CSRF token。

原理：用户访问修改email界面时，server端生成一个token保存在server端，同时也返回给前端页面的form中，并且要求提交表单的时候携带回来。这样server端接收到请求时，会校验token是否合法。
基于这个思想，csrf token还有进一步的演进方案。server端不保存token。而是将它保存在用户的浏览器Cookies中。请求的时候携带回来，与表单的中的csrf_token比较。这种方案也称为“double submit cookie”

前置知识：
1. CSRF攻击是利用用户浏览器中的`cookie`，但并不知道具体值是什么。（这个是与XSS攻击的区别）
2. 浏览器中`Cookie`无法通过脚本跨域名获取，这个功能是**浏览器**保证的。也就是我们在访问A网站的时候，A网站上脚本无论如何也无法获取到B网站的cookie。所以，我们把CSRF Token写到Cookie中，这个安全性是可以保证的。
3. 这个方案保证接口安全的前提是：前置步骤都是“安全”的。如果前置访问修改email界面是不安全的，黑客完全可以：先访问前置界面 => 获取scrf_token => 组装 scrf 攻击脚本。以这种方式继续攻击。

**强烈建议不要自己写，使用开源的CSRF Token包**

#### 确认接收到的请求来自合法的客户端
1. 检查请求头Origin和Referer

我们可以检查HTTP headers中的 `Origin` 和 `Referer`两个值，因为这两值在浏览器中执行的js是无法修改的。浏览器在请求时自动填充这两个值为当前的地址。
  -  这个方案可以作为辅助方案，可以用，但不要只用这一个方式来防护CSRF攻击。
  -  其他的只有浏览器可修改的header值也可以作为一种校验手段。资料：[Forbidden header name](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)

2. 使用`SameSite`限制`cookie`

简而言之，SameSite可以设置为三种值，按cookie的安全性从大到小：Strict, Lax, None.（None等于没限制）。
以Strict为例，设置了SameSite=Strict，浏览器在发送请求的时候就会检查，如果发送的目标地址，与当前页面domain不是同一个，那么就不会携带这个cookie。 这样黑客网站无法携带目标网站用户的session，那么请求也就不会通过，达到了防范CSRF的目的。

## 点击劫持（clickjacking attack）

一定要设置：
- `X-Frame-Option: sameorigin | deny` (在Http响应头中设置X-Frame-Option，从而禁用网站被其他网站嵌入iframe中。)
- `Content-Security-Policy: frame-ancestors 'self' | 'none'` (与上作用类似，互补兼容性)
- 对于生成的Cookie设置：`sameSite: 'strict'`

可选
- `frame-busting`方式，`frame-busting`对于**绕开浏览器的请求**会很有用
## 密码安全

### [加盐](https://www.cnblogs.com/apolloren/p/11985083.html)

对于密码存储来说，必然是不能明文存储在数据库中的，否则一旦数据库泄露，会对用户造成很大的损失。并且不建议只对密码单纯通过加密算法加密，因为存在彩虹表的关系。

通常需要对密码加盐，然后进行几次不同加密算法的加密。

```js
// 加盐也就是给原密码添加字符串，增加原密码长度
sha256(sha1(md5(salt + password + salt)))
```

但是加盐并不能阻止别人盗取账号，只能确保即使数据库泄露，也不会暴露用户的真实密码。一旦攻击者得到了用户的账号，可以通过暴力破解的方式破解密码。对于这种情况，通常使用验证码增加延时或者限制尝试次数的方式。并且一旦用户输入了错误的密码，也不能直接提示用户输错密码，而应该提示账号或密码错误。


### 对称加密和非对称加密

- 所谓的对称加密就是加密和解密用同一份密钥。对称加密的好处就是加密速度快，但是缺点也很明显，一定要保存好这份密钥，如果密钥丢失，就会带来很大的安全风险。而且如果与服务端进行通信的客户端比较多的话，服务端要管理很多份不同的密钥。

- 为了解决对称加密的缺点，人们提出了非对称加密，非对称加密技术也是目前应用最广泛的加密技术。所谓的非对称加密就是生成一对密钥，分为公钥和私钥。私钥自己保存，公钥发布出去。用私钥加密的信息只能用公钥解密，用公钥加密的信息也只能用私钥解密。

常见的 对称加密 算法主要有 `DES`、`3DES`、`AES` 等，常见的 非对称算法 主要有 `RSA`、`DSA` 等，散列算法主要有 `SHA-1`、`MD5` 等(属于信息摘要算法，用于信息摘要，以防止被篡改，可以被应用在检查 **文件完整性** 以及 **数字签名** 等场景)。

- [浅谈常见的七种加密算法及实现](https://www.jianshu.com/p/9000a0386e70)

[常见登录鉴权方案](https://75.team/post/common-login-authencation-scheme)
