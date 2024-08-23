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
// Python的字符串类型是str，在内存中以Unicode表示，一个字符对应若干个字节。如果要在网络上传输，或者保存到磁盘上，就需要把str变为以字节为单位的bytes。
str = 'abc'
str2 = "abc"
// boolean
e = Flase
f = Ture
// 空值
d = None

// 常量
PI = 3.14159265359

// 除法
aa = 10 / 3  // 3.3333333333333335
bb = 9 / 3 // 3.0 即使是两个整数恰好整除也是浮点数

```
* list
```python
classmates = ['Michael', 'Bob', 'Tracy']
length = len(classmates)
first = classmates[0]
// 索引不能越界, 会报一个IndexError错误
notfound = classmates[3] // error

// 添加
classmates.append('Adam')
classmates.insert(1, 'Jack') // ['Michael', 'Jack', 'Bob', 'Tracy', 'Adam']

// 删除list末尾的元素
classmates.pop() // =》 Adam
classmates.pop(1 // 删除指定位置的元素

// 替换
classmates[1] = 'Sarah'
// list里面的元素的数据类型也可以不同， 可嵌套
L = ['Apple', 123, True]

# 列表生成式 range
list(range(1, 11))
```
切片:取前3个元素 `classmates[0:3]`

* tuple

有序列表元组，tuple和list非常类似，但是tuple一旦初始化就不能修改

```python
classmates = ('Michael', 'Bob', 'Tracy')
```

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

* dict的key必须是**不可变对象**。
在Python中，字符串、整数等都是不可变的，因此，可以放心地作为key。而list是可变的，就不能作为key。
```python
d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
dd = d['Michael'] // => 95
// 删除
d.pop('Bob')
// 迭代
for key in d:
  print(key) // Michael...
```
迭代取value: `for value in d.values()`

* 如果key不存在，dict就会报错

如何判断：
- `'Thomas' in d`

`get`: 如果key不存在，可以返回`None`，或者自己指定的`value`：
- `d.get('Thomas')`
- `d.get('Thomas', -1)`

#### set
set和dict类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在set中，没有重复的key。
```python
s = set([1, 2, 3])
// 添加 add(key)
s.add(4)
// 删除 remove(key)
s.remove(4)
```
### 不可变对象
比如str是不变对象，而list是可变对象

对于可变对象，比如list，对list进行操作，list内部的内容是会变化的，比如：

```python
a = ['c', 'b', 'a']
a.sort() // a => ['a', 'b', 'c']
```
而对于不可变对象，比如str，对str进行操作
```python
a = 'abc'
a.replace('a', 'A') // => 'Abc'
a // => 'abc'
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
* 可变参数：参数前面加了一个`*`号，可变参数在函数调用时自动组装为一个tuple
```python
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
calc(1, 2)
nums = [1, 2, 3]
 calc(*nums)
```
* 关键字参数: `**arg`
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
* 命名关键字参数

  如果要限制关键字参数的名字，就可以用命名关键字参数，例如，只接收city和job作为关键字参数。这种方式定义的函数如下
```python
def person(name, age, *, city, job):
    print(name, age, city, job)
```
`person('Jack', 24, city='Beijing', job='Engineer')`

* 参数定义的顺序必须是：**必选参数、默认参数、可变参数、命名关键字参数和关键字参数**。

* 递归
```python
def fact(n):
    if n==1:
        return 1
    return n * fact(n - 1)
```

### 生成器generator
```python
g = (x * x for x in range(10))
for n in g:
  print(n) // => 0,1,4...64, 81
```
