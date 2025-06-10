# Python

- [Python教程](https://www.liaoxuefeng.com/wiki/1016959663602400)

## Basic

### shell

```shell
python --version

brew install pyenv
# 使用pyenv安装特定版本的Python
pyenv install 3.12
# 设置一个Python版本为全局默认
pyenv global 3.12.2
pyenv local 3.12.2  # 在当前目录设置本地Python版本
```

### 数据类型和变量

```python
a = 10_000_000_000
b = 3.14
# Python的字符串类型是str，在内存中以Unicode表示，一个字符对应若干个字节。如果要在网络上传输，或者保存到磁盘上，就需要把str变为以字节为单位的bytes。
str = 'abc'
str2 = "abc"
# boolean
e = Flase
f = Ture
# 空值
d = None

# 常量
PI = 3.14159265359

# 除法
aa = 10 / 3  # 3.3333333333333335
bb = 9 / 3 # 3.0 即使是两个整数恰好整除也是浮点数

```

- list

```python
classmates = ['Michael', 'Bob', 'Tracy']
length = len(classmates)
first = classmates[0]
# 索引不能越界, 会报一个IndexError错误
notfound = classmates[3] # error

# 添加
classmates.append('Adam')
classmates.insert(1, 'Jack') # ['Michael', 'Jack', 'Bob', 'Tracy', 'Adam']

# 删除list末尾的元素
classmates.pop() # =》 Adam
classmates.pop(1 # 删除指定位置的元素

# 替换
classmates[1] = 'Sarah'
# list里面的元素的数据类型也可以不同， 可嵌套
L = ['Apple', 123, True]

# 列表生成式 range
list(range(1, 11))
```

切片:取前3个元素 `classmates[0:3]`

- tuple

有序列表元组，tuple和list非常类似，但是tuple一旦初始化就不能修改

```python
classmates = ('Michael', 'Bob', 'Tracy')
```

- 倒数第一个元素的索引是-1

### 条件判断

```python
age = 3
if age >= 18:
    print('adult')
elif age >= 6:
    print('teenager')
else:
    print('kid')
```

### 模式匹配

类似switch吧

```python
score = 'B'

match score:
    case 'A':
        print('score is A.')
    case 'B':
        print('score is B.')
    case 'C':
        print('score is C.')
    case _: # _表示匹配到其他任何情况
        print('score is ???.')
```

### 循环

`for x in ...`

```python
names = ['Michael', 'Bob', 'Tracy']
for name in names:
    print(name)

sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n - 2
print(sum)
```

### dict and set

dist即其他语言中的map，使用键-值（key-value）存储，具有极快的查找速度，对比list，dict是用空间来换取时间的一种方法。

- dict的key必须是**不可变对象**。
  在Python中，字符串、整数等都是不可变的，因此，可以放心地作为key。而list是可变的，就不能作为key。

```python
d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
dd = d['Michael'] # => 95
# 删除
d.pop('Bob')
# 迭代
for key in d:
  print(key) # Michael...
```

迭代取value: `for value in d.values()`

- 如果key不存在，dict就会报错

如何判断：

- `'Thomas' in d`

`get`: 如果key不存在，可以返回`None`，或者自己指定的`value`：

- `d.get('Thomas')`
- `d.get('Thomas', -1)`

#### set

set和dict类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在set中，没有重复的key。

```python
s = set([1, 2, 3])
# 添加 add(key)
s.add(4)
# 删除 remove(key)
s.remove(4)
```

### 不可变对象

比如str是不变对象，而list是可变对象

对于可变对象，比如list，对list进行操作，list内部的内容是会变化的，比如：

```python
a = ['c', 'b', 'a']
a.sort() # a => ['a', 'b', 'c']
```

而对于不可变对象，比如str，对str进行操作

```python
a = 'abc'
a.replace('a', 'A') # => 'Abc'
a # => 'abc'
```

其实就是a是一个变量，它是能变，但'abc'才是字符串对象，是不会变的

### 函数

```python
def my_abs(x):
    if x >= 0:
        return x
    else:
        return -x
```

- 可变参数：参数前面加了一个`*`号，可变参数在函数调用时自动组装为一个tuple

```python
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
calc(1, 2)
# 把list或tuple的元素变成可变参数传进去
nums = [1, 2, 3]
calc(*nums)
```

- 关键字参数: `**arg`

```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)
```

函数person除了必选参数name和age外，还接受关键字参数`kw`。在调用该函数时，可以只传入必选参数：
`person('Michael', 30)`

```python
def person(name, age, **kw):
    if 'city' in kw:
        # 有city参数
        pass
    if 'job' in kw:
        # 有job参数
        pass
    print('name:', name, 'age:', age, 'other:', kw)
```

调用者仍可以传入不受限制的关键字参数：

`person('Jack', 24, city='Beijing', addr='Chaoyang', zipcode=123456)`

- 命名关键字参数

  如果要限制关键字参数的名字，就可以用命名关键字参数，例如，只接收city和job作为关键字参数。这种方式定义的函数如下

```python
def person(name, age, *, city, job):
    print(name, age, city, job)
```

和关键字参数`**kw`不同，命名关键字参数需要一个特殊分隔符`*`，`*`后面的参数被视为命名关键字参数。调用：
`person('Jack', 24, city='Beijing', job='Engineer')`

命名关键字参数**必须传入参数名**，这和位置参数不同。如果没有传入参数名，调用将报错。

- 参数定义的顺序必须是：**必选参数、默认参数、可变参数、命名关键字参数和关键字参数**。

- 递归

```python
def fact(n):
    if n==1:
        return 1
    return n * fact(n - 1)
```

### 切片

```python
L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack']
# 取前3个元素
M = L[0:3]
# 第一个索引是0，还可以省略
M = L[:3]
# 原样复制一个list
M = L[:]
# tuple也是一种list，操作的结果仍是tuple
t = (0, 1, 2, 3, 4, 5)[:3]
# 字符串'xxx'也可以看成是一种list
str = 'ABCDEFG'[:3]
```

### 列表生成式

```python
list(range(1, 11))
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

```python
g = (x * x for x in range(10))
for n in g:
  print(n) # => 0,1,4...64, 81
```

with `if ...else...`

在一个列表生成式中，`for`前面的`if ... else`是表达式，而`for`后面的`if`是过滤条件，不能带`else`。

```python
[x for x in range(1, 11) if x % 2 == 0]
# [2, 4, 6, 8, 10]

[x if x % 2 == 0 else -x for x in range(1, 11)]
# [-1, 2, -3, 4, -5, 6, -7, 8, -9, 10]
```

### 生成器generator

把一个列表生成式的`[]`改成`()`，就创建了一个generator：

```python
g = (x * x for x in range(10))
a = next(g) # 0
b = next(g) # 1
```

### 可迭代对象Iterable

`isinstance()`判断一个对象是否是`Iterable`对象：
```python
from collections.abc import Iterable
isinstance([], Iterable) # True
isinstance(100, Iterable) # False
```
而生成器不但可以作用于`for`循环，还可以被`next()`函数不断调用并返回下一个值，直到最后抛出`StopIteration`错误表示无法继续返回下一个值了。

可以被`next()`函数调用并不断返回下一个值的对象称为迭代器：`Iterator`。

可以使用`isinstance()`判断一个对象是否是`Iterator`对象：

```python
from collections.abc import Iterator
isinstance((x for x in range(10)), Iterator) # True
isinstance([], Iterator) # False
isisstance(100, Iterator) # False
```
- 凡是可作用于`for`循环的对象都是`Iterable`类型；
- 凡是可作用于`next()`函数的对象都是`Iterator`类型，它们表示一个惰性计算的序列；
- 集合数据类型如`list`、`dict`、`str`等是`Iterable`但不是`Iterator`，不过可以通过`iter()`函数获得一个`Iterator`对象。

Python的for循环本质上就是通过不断调用`next()`函数实现的，例如：

```python
for x in [1, 2, 3, 4, 5]:
    pass
```
实际上完全等价于：
```python
# 首先获得Iterator对象:
it = iter([1, 2, 3, 4, 5])
# 循环:
while True:
    try:
        # 获得下一个值:
        x = next(it)
    except StopIteration:
        # 遇到StopIteration就退出循环
        break
```

## 函数式编程

### 高阶函数

#### map/reduce

把这个list所有数字转为字符串：
```python
list(map(str, [1,2,3,4,5,6]
```
reduce: `reduce(f, [x1, x2, x3, x4]) = f(f(f(x1, x2), x3), x4)`

把序列`[1, 3, 5, 7, 9]`变换成整数13579

```py
def fn(x, y):
    return x * 10 + y
reduce(fn, [1, 3, 5, 7, 9])
```
#### filter

在一个list中，删掉偶数，只保留奇数

```py
def is_odd(n):
    return n % 2 == 1

list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))
# 结果: [1, 5, 9, 15]
```
#### sorted

```python
sorted([36, 5, -12, 9, -21]) # => [-21, -12, 5, 9, 36]
# 接收一个key函数来实现自定义的排序，例如按绝对值大小排序
sorted([36, 5, -12, 9, -21], key=abs) # => [5, 9, -12, -21, 36]
```
