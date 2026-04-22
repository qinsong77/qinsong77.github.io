# 犯错记录

## 日期字符串解析的时区陷阱

### 问题现象

```js
// GMT+08:00 环境
new Date('2019-10-10').getDate() // 10 ✅

// GMT-10:00 环境
new Date('2019-10-10').getDate() // 9 ❌
```

### 根本原因

JS 解析日期字符串时，**不同分隔符使用不同规则**：

- `YYYY-MM-DD`（连字符）→ 解析为 **UTC 午夜**（遵循 ISO 8601）
- `YYYY/MM/DD` 或 `YYYY-M-D`（非严格格式）→ 解析为**本地时间午夜**

```js
// 中国时区（GMT+8）下，连字符格式被当作 UTC，显示时加了 8 小时
new Date('2019-09-01')   // Sun Sep 01 2019 08:00:00 GMT+0800
new Date('2019/09/01')   // Sun Sep 01 2019 00:00:00 GMT+0800
new Date('2019-9-1')     // Sun Sep 01 2019 00:00:00 GMT+0800
```

因此在 **负时区**环境下，UTC 午夜转为本地时间后会倒退到前一天，导致 `getDate()` 少 1。

### 解决方案

```js
// ❌ 避免：依赖模糊的字符串解析
new Date('2024-01-15')

// ✅ 明确指定本地时间（追加时间部分）
new Date('2024-01-15 00:00:00')

// ✅ 使用多参数构造（本地时区）
new Date(2024, 0, 15)

// ✅ 明确指定 UTC
new Date(Date.UTC(2024, 0, 15))

// ✅ 明确指定时区偏移
new Date('2024-01-15T00:00:00+08:00')

// ✅ 使用日期库（推荐）
import dayjs from 'dayjs'
dayjs('2024-01-15').toDate()
```

> 推荐使用 `dayjs` 或 `date-fns` 处理日期，避免手动解析字符串。

---

## 时间标准简介

### GMT

**Greenwich Mean Time**，格林威治标准时间。以英国格林威治天文台为基准，全球 24 个时区均以与 GMT 的偏移量表示，例如：

- 北京：GMT+8（CST，中国标准时间）
- 纽约：GMT-4（夏令时）

### UTC

**Coordinated Universal Time**，协调世界时。基于原子钟，是目前全球通用的时间标准。UTC 与 GMT 在数值上几乎相同，唯一区别是 **UTC 有闰秒，GMT 没有**。通常说的"UTC 时间"默认指 UTC+0。

### ISO 8601

日期时间的**格式规范**，例如 `2024-01-15T10:30:45.123Z`。其中：

- `T` 分隔日期与时间
- `Z` 表示 UTC 时间，等价于 `+00:00`
- 也可携带时区偏移：`2024-01-15T10:30:45+08:00`

---

## JS 中的时间 API

`Date` 对象内部以 **UTC 时间戳**（自 1970-01-01 00:00:00 UTC 起的毫秒数）存储时间，所有本地时间方法都是基于运行环境的时区转换而来。

```js
const now = new Date()

// 时间戳（与时区无关）
now.getTime()           // e.g. 1705316045123

// 本地时间方法
now.getFullYear()       // 本地年份
now.getHours()          // 本地小时

// UTC 方法
now.getUTCFullYear()    // UTC 年份
now.getUTCHours()       // UTC 小时

// 格式化输出
now.toISOString()       // "2024-01-15T10:30:45.123Z"  (始终 UTC)
now.toUTCString()       // "Mon, 15 Jan 2024 10:30:45 GMT"
```

**时间戳**（timestamp）：从 `1970-01-01 00:00:00 UTC` 起至今的毫秒数，与时区无关。

```js
new Date('1970-01-01T00:00:00Z').getTime() // 0
new Date('1969-12-31T00:00:00Z').getTime() // -86400000
```

---

## 测试环境设置时区

在 Jest 中，可通过 `globalSetup` 覆盖时区：

```js
// test-setup/global-setup.js
module.exports = async () => {
  process.env.TZ = 'America/New_York'
}

// jest.config.js
module.exports = {
  globalSetup: './test-setup/global-setup.js'
}
```

> Cypress 配置 `env.TZ` 在与 Nx 集成时可能不生效，建议用 Jest 覆盖时区进行相关测试。

---

参考：
- [前端时间国际化入门](https://mp.weixin.qq.com/s/Gw6UiovEvu76a-9zxL3BdA)
- [时区与 JS 中的 Date 对象](https://juejin.cn/post/6844903885505576968)
