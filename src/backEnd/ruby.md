# Ruby

- [前端学 Ruby](https://mp.weixin.qq.com/s?__biz=MzA5MzQzMTU1Ng==&mid=2651002628&idx=1&sn=af9f515f5a1ab01959236ed2ead76dae&chksm=8baa456fbcddcc791b41d316a478d630279e65526757c92f83b957a5fa8bef270d8d172764fd&scene=178&cur_album_id=2972854489406521345#rd)

## General

Ruby 是一款**解释型、弱类型、动态类型**的面向对象编程语言

- RVM: 管理多个 Ruby 版本,类似nvm
- Gems: Ruby 项目的包管理工具, ruby自带，类似node自带npm
  - gem list：查看所有的包
  - gem install xx：下载应用包
  - gem uninstall：卸载应用包
  - gem sources：查看当前镜像
### 命名风格
像变量（variable）、符号（symbol）、方法（method），通常使用 snake_case 风格（snake_case 风格即短语内的各个单词之间以下划线做间隔）

像常数（constant），使用 CONST_FOO 风格

类名（class name），使用骆驼 （CamelCase）风格

文件名（file name），使用 snake_case 风格

`$`开头的变量：全局变量

`@`开头的变量：实例变量

`@@`开头的变量：类变量

小写字母或者下划线（_）开头的变量：局部变量

## 类型

Ruby 中所有值都是对象（包括 `nil` 值）, Ruby 不像其他语言一样区分基本类型(primitive types) 和对象类型(object types)，对于 Ruby 而言，所有类型都继承自 `Object类`(根类为 `BasicObject`).

通过 `x.class` 能得知它的数据类型，通过`object_id` 得知它的内存地址

### 数字(Numeric)

Ruby 中包含五种 built-in 数字类型类: `Numeric`, `Integer`, `Float`, `Fixnum` 和 `Bignum`, 另外标准库中还提供了三种数字类型：`Complex`, `BigDecimal`, `Rational`. 除 `Numeric` 类外其他数字类型类都继承自 `Numeric`, 关系如下：

                                +-----------+
                                |           |
                                |  Numeric  |
                                |           |
         +-----------+----------++----------+--+--------------+
         |           |           |             |              |
         |           |           |             |              |
    +----+----+  +---+---+  +----+----+  +-----+------+  +----+-----+
    |         |  |       |  |         |  |            |  |          |
    | Integer |  | Float |  | Complex |  | BigDecimal |  | Rational |
    |         |  |       |  |         |  |            |  |          |
    +--+------+  +-------+  +---------+  +------------+  +----------+
       |      |
       |      |
    +------+-+  +-+------+
    |        |  |        |
    | Fixnum |  | Bignum |
    |        |  |        |
    +--------+  +--------+
```ruby
66 # 66
66.class # Integer 整数
3.2 # 3.2
3.2.class # Float 浮点数
3.even? # 是否为偶数
3.odd? # 是否为奇数
283.to_s # 转化为 string 
3.times { p 'love' } # 打印三次 love
3 & 1 # 1 
3.232323.round(2) # 小数点保留 2 位
```
#### 浮点数精度问题

Float 类型也是遵循`IEEE 754`，和javascript一样也有下面的问题

```ruby
0.4 - 0.3 == 0.1
```

结果为 `false`

```ruby
require 'bigdecimal'
BigDecimal('0.4') - BigDecimal('0.3') == BigDecimal('0.1')
```

### 字符串

变量或表达式内嵌 `#{ expr })`, eg:`"360 degrees = #{2*Math::PI} radians"`

```ruby
a = 'asdf' # asdf 将 asdf 赋值给a
a[0] = 'b' # ruby 中一切皆对象
a.object_id # 70123455667 
a[1] = 'c' # c
a.object_id # 70123455667 ，a 不变
b = 'asdf' # 与 a 的值一样
b.object_id # 72343954534，但 object_id 不一样，说明他们的内存地址不一样，和 JavaScript 的引用类型一样，每次赋值都存在堆内存里，所以说 ruby 性能差
# 在 Ruby 中，一切皆对象，比 JavaScript 更加彻底
a.class # String class 方法是判断它的类型
```
字符串的多种赋值方式
```ruby
a = 'asdf' # 用单引号
"something#{a}" # somethingasdf 双引号相当于 javascript 中的模板字符串(``)
%q('asddas'dasda'') # "'asddas'dasda''"  保留你输入的任何值
%Q("sadsd") # "\"\"sadsd\"\"" 转义 
<<-Text
sdsd
dsadsad
dsdas
TEXT # 多行
"asdfgh".reverse # hgfdsa 反转
"hello".include?('o') # true 是否存在字母o
"hello".index('l') # 2
"asdf".sub('s', 'b') # "adbf" 将 s 替换成 b
"asdf".sub!('s', 'b') # "abdf" 
! 有什么用呢，它能改变原值
a = 'asdf' # asdf
a.sub('s', 'b') # abdf
a # asdf  a 的值没有变化
a.sub!('s', 'b') # abdf
a # abdf  a 的值发生改变
a.size # 字符串长度
```
### 数组

```ruby
a = [1,2,3]
# 动态类型
a[0] = 'zero' # ['zero', 2, 3]

# 添加使用push 方法，或者更简单的 <<
a << 1        # 1
a << 2 << 3   # [1, 2, 3]
a << [4, 5]   # [1, 2, 3, [4, 5]] 嵌套数组

# 数组下标
a = [1, 2, 3, 4, 5]
a[0]          # 1
a[-2]         # 4, 负数下标从最后一个倒数

# 获取子数组
a[1, 2]       # [2, 3] 第一个下标数字表示起始下标，第二个表示子数组长度
a[1, 0]       # []
a[0...-1]     # [1, 2, 3, 4]
```

### 哈希表(Hash)/字典集合

Hash 是以`{}`表示的键值对数据结构, `h = {'one' => 1, 'two' => '2'}`

```ruby
hash = {"color" => "green", "number" => 5}

hash.keys #=> ['color', 'number']

# 哈希表可以通过键快速地查询
hash['color'] # => 'green'
hash['number'] # => 5

# 查询一个不存在的键会返回 nil
hash['nothing here'] # => nil

# 添加数据
hash['print'] = 27.6 # => 27.6
```

#### 哈希的方法
```ruby
h = {a: 1, b: 2}
h[:c] = 3
h # {:a=>1, :b=>2, c=>3}
h[:a] # 1
h.delete(:a) # 1
h # {:b=>2, c=>3}
h.assoc(:b) # 获取 key 和 value [:b, 2]
h.empty?() false 
h.has_value?(2) # 是否有值 2, true
h.has_key?(:b) # 是否有值:b, true
h.keys # [:b, :c]
h.values  # [2, 3]
h.to_a # 变成 array [[:b, 2], [:c, 3]]
h2 = {d: 4}
h.merge(h2) # {:b=>2,:c=>3,:d=>4}
```

#### hash 的遍历方法
```ruby
h.each { |key, value| p [key, value]} # [:b, 2] [:c, 3]
h.each_key { |key| p key } # :b :c
h.each_value {|v| p v} # 2 3
h.select { |key| key == :b} # {:b=>2}
```

### 集合（Set）
```ruby
require 'set' # 命令行中默认不引用 set
a = Set.new [1, 2] # <Set: {1, 2}>
a.add("foo") # Set: {1, 2, "foo"}>
b = Set.new [2, 3, 4] #Set: {2, 3, 4}>
a & b # Set: {2}>
a | b # Set: {1, 2, ”foo", "3", "4"}>
a <= b # b 是否是 a 的子集， false
b <= a # a 是否是 b 的子集， false
```
### true, false, nil

除了 `false` 和 `nil` 外，其他值都为 `true`:

```ruby
!true   # false
!false  # true
!nil    # true
!0      # false
![]     # false
```

`nil` 表示空值。对于值判空操作可调用 `nil?` 方法：

```ruby
true.nil?   # false
nil.nil?    # true
```

`Symbol`：符号：不可变类型。优点，查找速度快，缺点是不会被垃圾回收，造成内存不够的可能



### defined? 操作符

`defined?` 操作符可以判断变量、函数、符号等是否定义：如果右值定义，则返回一个字符串；否则为 `nil`.

```ruby
a = []
defined? a    # "local-variable"
defined? b    # nil
defined? nil  # "nil" 注意这里返回的是 "nil" 字符串
```

## 条件

```ruby
if x == 1
  name = "one"
elsif x == 2
  name = "two"
else
  name = "many"
end
```

or simply:

```ruby
name = if x == 1 then "one"
       elsif x == 2 then "two"
       else "many"
       end
```

如果表达式只有一句，**if 一般放在语句后面**，更符合英语语法习惯：

`name = "one" if x == 1`

## 循环/迭代器

### while 循环
只要语句为真，代码块中的代码就会被执行，如打印 1 到 10 的数字：
```ruby
num = 1

while num <= 10
    puts num
    num += 1
end
```
### For 循环
```ruby
for num in 1...10
    puts num
end
```
### Each 迭代器
```ruby
data.each { |x| puts x }    # 打印 data 中每一个元素
[1, 2, 3].map { |x| x*x }   # 返回 [1, 4, 9]
[1, 2, 3, 4, 5].each do |num|
    puts num
end
```

## 异常处理

Ruby 中也有 `throw` 和 `catch` 关键字，但这两个配对主要是用在多层循环语句中直接跳出，类似于 C 语言中的 goto. Ruby 的异常处理使用 `raise/rescue/ensure`, 相当于 Java 中的 `try/catch/finally`.

```ruby
begin
  ...
rescue RuntimeError => e
  puts e.message
rescue => e
  puts "#{e.class}: #{e.message}"
ensure
  ...
end
```

## 方法

```ruby
def factorial(n)
  if n < 1
    raise "argument must be > 0"
  elsif n == 1
    1
  else
    n * factorial(n-1)
  end
end
```

方法中的 `return` 关键字可省略，除非提前条件退出的逻辑需加上 `return`.
调用方法时，可省略小括号`()`，如：`factorial 10`

### 参数

方法支持默认参数：

```ruby
def prefix(s, len=1)
  s[0, len]
end
```

支持**可变参数**，参数作为数组使用：

```ruby
def max(first, *rest)
  max = first
  rest.each {|x| max = x if x > max}
  max
end

max 1       # first=1, rest=[]
max 1, 2, 3 # first=1, rest=[2, 3]
```

如果将数组作为参数传入方法，需要在数组变量前加 `*`:

```ruby
data = [3, 2, 1]
max 1, *data  # first=1, rest=[3, 2, 1]
max *data     # first=3, rest=[2, 1]
max data      # first=[3, 2, 1], rest=[]
```

如果哈希值作为最后一个参数，可以省略调用的 `{}`

```ruby
def sequence(args)
  m = args[:m] || 1
  n = args[:n] || 0
  ...
end

sequence m:3, n:5
```

### 关键字参数（keyword argument）

通过冒号 `:` 后跟参数名来指定关键字参数，eg

```ruby
def greet(name:, age:)
  puts "Hello, #{name}! You are #{age} years old."
end
```

name 和 age 都是关键字参数。

默认值:

```ruby
def greet(name: "Guest", age: 0)
  puts "Hello, #{name}! You are #{age} years old."
end

greet(age: 30) # name 使用默认值 "Guest"
```

与普通参数的区别: 关键字参数与普通参数不同，普通参数必须**按顺序提供**，而**关键字参数则不需要**。此外，普通参数可以有任意数量的值，而关键字参数的数量是固定的：

## class

类名需以大写字母开头：

```ruby
class Point
end
```

实例化对象：`p = Point.new`

成员变量名以 `@` 开头，类变量名以 `@@` 开头。类的构造函数名称为 `initialize`。

```ruby
class Point
  def initialize(x, y)
    @x, @y = x, y
  end

  def x; @x; end  # @x 的 getter 方法
  def y; @y; end

  def x=(value)   # @x 的 setter 方法
    @x = value
  end

  def y=(value)
    @y = value
  end
```

更简洁的语法可以自动生成 `getter` 和 `setter` 方法功能：

```ruby
class Point
  attr_accessor :x, :y

  def initialize(x, y)
    @x, @y = x, y
  end
end
```

如果是只读成员变量仅提供 `getter` 方法的话可以使用 `attr_reader` 关键字：`attr_reader :x`

### 类方法

`类方法`定义与`成员方法`定义不同在方法名前加类名或 `self` 关键字：

```ruby
class Point
  def Point.sum(*points)
    ...
  end

  def self.top(*points)
    ...
  end
end
```

### public, protected, private

方法默认为 public, protected, private 的方法需要显示声明。

### 继承

类的继承用符号 `<`，继承特性与其他面向对象语言类似，方法可被子类重写，重写方法如果需要调用父类方法，可使用 `super` 关键字来调用。

```ruby
class Point3D < Point
  def initialize(x,y,z)
    super(x,y)
    @z = z
  end
end
```

### `class << self`

`class << self` 语法用于定义单件类（singleton class），也称为元类（eigenclass）或类类（class class）。单件类是Ruby中一个对象的类，它**只能有一个实例**，即这个对象本身。

当你在一个类定义中使用 `class << self` 时，你实际上是在定义这个类的单件类的实例方法，也就是说，这些方法只能通过类本身调用，而不是类的实例。这在实现类级别的自定义行为时非常有用，特别是当你想要定义一些只与类本身相关的方法时。

```ruby
class MyClass
  def self.my_class_method
    "这是一个类方法"
  end

  class << self
    def my_singleton_method
      "这是一个单件类方法"
    end
  end
end

# 调用类方法
puts MyClass.my_class_method  # 输出: 这是一个类方法

# 调用单件类方法
puts MyClass.my_singleton_method  # 输出: 这是一个单件类方法

# 尝试通过实例调用单件类方法会报错
# my_object = MyClass.new
# my_object.my_singleton_method  # NoMethodError: undefined method `my_singleton_method' for ...
```

单件类方法的一个常见用途是在类中定义类变量或类级配置选项。例如，Rails框架中就大量使用了单件类来定义和访问类级别的配置。

使用 `class << self` 的另一个好处是它提供了一个清晰的命名空间，可以避免类方法和实例方法之间的命名冲突。此外，单件类方法也可以访问类变量，这使得它们非常适合用于存储和管理与类相关的数据。

## Rails

Rails 是使用 Ruby 语言写的 Web 应用框架。它有两大指导“思想”

- 不要自我重复（DRY）
- 多约定，少配置（约定大于配置)

```shell
rails new blog # 生成一个 blog 项目
rails new --api blog # 以 API 形式生成一 blog 项目
rails new --css bootstrap blog # 以 bootstrap 作为css生成一 blog 项目
rails new --database postgresql blog # 以 postgres sql 作为数据库生成项目
rails new -h # 查看所有命令行选项
rails new --api --database=postgresql --skip-test blog # 创建一个数据库为 postgresql 的跳过测试的 api 博客（blog）项目
```

### Folder structure

| 文件/文件夹           | 作用                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app/                  | 包含应用的控制器、模型、视图、辅助方法、邮件程序、频道、作业和静态资源文件。这个文件夹是本文剩余内容关注的重点。                                                |
| bin/                  | 包含用于启动应用的 rails 脚本，以及用于安装、更新、部署或运行应用的其他脚本。                                                                                   |
| config/               | 配置应用的路由、数据库等。详情请参阅配置 Rails 应用。                                                                                                           |
| config.ru             | 基于 Rack 的服务器所需的 Rack 配置，用于启动应用。                                                                                                              |
| db/                   | 包含当前数据库的模式，以及数据库迁移文件。                                                                                                                      |
| Gemfile, Gemfile.lock | 这两个文件用于指定 Rails 应用所需的 gem 依赖。Bundler gem 需要用到这两个文件。关于 Bundler 的更多介绍，请访问 Bundler 官网。                                    |
| lib/                  | 应用的扩展模块。                                                                                                                                                |
| log/                  | 应用日志文件。                                                                                                                                                  |
| public/               | 仅有的可以直接从外部访问的文件夹，包含静态文件和编译后的静态资源文件。                                                                                          |
| Rakefile              | 定位并加载可在命令行中执行的任务。这些任务在 Rails 的各个组件中定义。如果要添加自定义任务，请不要修改 Rakefile，直接把自定义任务保存在 lib/tasks 文件夹中即可。 |
| README.md             | 应用的自述文件，说明应用的用途、安装方法等。                                                                                                                    |
| test/                 | 单元测试、固件和其他测试装置。详情请参阅Rails 应用测试指南。                                                                                                    |
| tmp/                  | 临时文件（如缓存和 PID 文件）。                                                                                                                                 |
| vendor/               | 包含第三方代码，如第三方 gem。                                                                                                                                  |

下载依赖是通过 `bundle install` ，相当于前端的 `npm install`
```shell
rails server # 启动服务
rails s -p 8080 # s 为 server 缩写，-p 8080 表示指定8080的端口
```
