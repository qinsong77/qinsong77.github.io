#  犯错记录

## 处理 YYYY-MM-DD 这样的日期字符串

```js
// code is runningg on GMT +08:00
const d = new Date('2019-10-10');
const date = d.getDate();

// 10
// Looks good!


// code is runningg on GMT -10:00
const d = new Date('2019-10-10');
const date = d.getDate();

// 9
// Amazing?!
```

在小于0时区的地方，直接用 new Date('YYYY-MM-DD') 这样的方式实例化日期并且获取日期，永远会少一天。但是使用 new Date('YYYY-MM-DD 00:00:00') 就不会。

其实是使用 `new Date()` 转换年月日字符串日期，只是`YYYY-MM-DD`这种格式，有bug，就是会自动根据本地时区，在传入日期的基础上，加上或者减去时差

```js
const timeOffset = new Date('2019-09-01').getTime() - new Date('2019/09/01').getTime()
console.log(timeOffset/(1000 * 60 * 60)) // => 8
```

```js
// 中国时区，自动加了8个小时
console.log(new Date('2019-09-01')) // Sun Sep 01 2019 08:00:00 GMT+0800 (中国标准时间)

console.log(new Date('2019-9-01')) // Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间)
console.log(new Date('2019-9-1')) // Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间)
console.log(new Date('2019/09/01')) // Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间)
console.log(new Date('2019/9/1')) // Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间)
```
问题本质，就在于 js 在解析**日期字符串**时，对于不同的分隔符，使用了不同的 规则。

2种解决办法：
1. 强行指定时间
```js
console.log(new Date('2019-09-01 00:00:00'))
// Sun Sep 01 2019 00:00:00 GMT+0800 (中国标准时间)
```
2. 使用`/`分割符号

```js
import { parse } from 'date-fns'
parse('1993-12-24', 'yyyy-MM-dd', new Date())
```
所以一般最好用库处理时间：`dayjs`, `date-fns`, `moment.js`(体积太大了)

````js
moment('2019-10-10').toDate()
// Thu Oct 10 2019 00:00:00 GMT+0800 (中国标准时间)

moment('2019-10-10 00:00:00').toDate()
// Thu Oct 10 2019 00:00:00 GMT+0800 (中国标准时间)

````
[时区与JS中的Date对象](https://juejin.cn/post/6844903885505576968)

#### cypress 设置time-zone失败

配置`env.TZ=America/New_York`不起作用，可能是和nx结合后失效，当然cypress官网也没查到怎么配置。

后续是配置在jest中配置cover time-zone测试

```js
// test-setup/global-setup.js
module.exports = async () => {
    process.env.TZ = "America/New_York"
}
```
```js
// jest config.js

module.exports = {
    globalSetup: './test-setup/global-setup.js'
}
```

### 常见的时间标准

#### GMT

GMT 即 Greenwich Mean Time， 代表格林威治标准时间。

对全球而言，这里所设定的时间是世界时间参考点，全球都以格林威治的时间作为标准来设定时间。


```js
new Date()
// Sat Jun 15 2019 17:55:58 GMT+0800 (中国标准时间)

new Date('2020-10-10 00:08:19')
// Sat Oct 10 2020 00:08:19 GMT+0800 (中国标准时间)

```

常说的 时间戳，`timestamp` 就是指格林威治时间`1970年01月01日00时00分00秒`(北京时间1970年01月01日08时00分00秒)起至现在的总秒数，js 中出输出的 timestamp 是到毫秒级的。
```js
new Date('1970-01-01').getTime();
// 0

new Date('1969-12-31').getTime();
// -86400000

```

### UTC
UTC 即 Coordinated Universal Time，代表世界协调时间或协调世界时。

UTC是经过平均太阳时(以格林威治时间GMT为准)、地轴运动修正后的新时标以及以“秒”为单位的国际原子时所综合精算而成的时间，计算过程相当严谨精密。协调世界时是最接近GMT的几个替代时间系统之一。
普遍认为，UTC时间被认为能与GMT时间互换，但GMT时间已不再被科学界所确定。
一般来说，当我们提到 UTC 时间 而不带任何别的修饰时，常指 UTC 0点。
UTC 和 GMT 唯一的差别，UTC 有闰秒，GMT 没有。


不同的浏览器显示效果相同，Chrome会显示 GMT，以及一个已经翻译好的地方时区标准：

```js
new Date();
// Sat Jun 15 2019 20:36:10 GMT+0800 (中国标准时间)

```
