# Mysql

- SQL（发音为字母S-Q-L或sequel）是结构化查询语言（Structured Query
  Language）的缩写。SQL是一种专门用来与数据库通信的语言。

`SHOW DATABASES;` 列出所有数据库，末尾的分号要加上

![](./image/show-database.png)

其中，`information_schema`、`mysql`、`performance_schema`和`sys`是系统库，不要去改动它们。其他的是用户创建的数据库。

- 创建一个新数据库: `CREATE DATABASE test;`
- 删除一个数据库: `DROP DATABASE test;`,删除一个数据库将导致该数据库的所有表全部被删除。
- 切换为当前数据库：`USE test;`

### 表

- 列出当前数据库的所有表： `SHOW TABLES;`
- 查看一个表的结构: `DESC students;`
- 查看创建表的SQL语句：`SHOW CREATE TABLE students;`
- 删除表: `DROP TABLE students;`

```sql
CREATE TABLE `students` (
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`class_id` bigint(20) NOT NULL,
`name` varchar(100) NOT NULL,
`gender` varchar(1) NOT NULL,
`score` int(11) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8
```

#### 列

- 增加列：给students表新增一列birth： `ALTER TABLE students ADD COLUMN birth VARCHAR(10) NOT NULL;`
- 修改列：把列名改为birthday，类型改为VARCHAR(20)：`ALTER TABLE students CHANGE COLUMN birth birthday VARCHAR(20) NOT NULL;`
- 删除列: `ALTER TABLE students DROP COLUMN birthday;`


### DISTINCT

`SELECT DISTINCT columns FROM table_name WHERE where_conditions;`

```sql
mysql> SELECT DISTINCT age FROM student;
+------+
| age  |
+------+
|   10 |
|   12 |
|   11 |
| NULL |
+------+
4 rows in set (0.01 sec)
```

`DISTINCT` 关键词用于返回唯一不同的值。放在查询语句中的第一个字段前使用，且作用于主句所有列。

如果列具有`NULL`值，并且对该列使用`DISTINCT子`句，MySQL将保留一个`NULL`值，并删除其它的`NULL`值，因为`DISTINCT`子句将所有`NULL`值视为相同的值。

#### distinct多列去重

distinct多列的去重，则是根据指定的去重的列信息来进行，即只有所有指定的列信息都相同，才会被认为是重复的信息。

```sql
SELECT DISTINCT column1,column2 FROM table_name WHERE where_conditions;
mysql> SELECT DISTINCT sex,age FROM student;
+--------+------+
| sex    | age  |
+--------+------+
| male   |   10 |
| female |   12 |
| male   |   11 |
| male   | NULL |
| female |   11 |
+--------+------+
5 rows in set (0.02 sec)
```

### group by

对于基础去重来说，group by的使用和distinct类似:

`SELECT columns FROM table_name WHERE where_conditions GROUP BY columns;`

```sql
mysql> SELECT age FROM student GROUP BY age;
+------+
| age  |
+------+
|   10 |
|   12 |
|   11 |
| NULL |
+------+
4 rows in set (0.02 sec)
```

多列去重:

`SELECT columns FROM table_name WHERE where_conditions GROUP BY columns;`

```sql
mysql> SELECT sex,age FROM student GROUP BY sex,age;
+--------+------+
| sex    | age  |
+--------+------+
| male   |   10 |
| female |   12 |
| male   |   11 |
| male   | NULL |
| female |   11 |
+--------+------+
5 rows in set (0.03 sec)
```

两者的语法区别在于，`group b`y可以进行单列去重，`group by`的原理是先对结果进行分组排序，然后返回每组中的第一条数据。且是根据`group by`的后接字段进行去重的。


在大多数例子中，`DISTINCT`可以被看作是特殊的`GROUP BY`，它们的实现都基于分组操作，且都可以通过松散索引扫描、紧凑索引扫描来实现。
#### distinct vs group

- 在语义相同，有索引的情况下：`group by`和`distinct`都能使用索引，效率相同。
- 在语义相同，无索引的情况下：`distinct`效率高于`group by`。原因是`distinct` 和 `group by`都会进行分组操作，但`group by`可能会进行排序，触发`filesort`，导致sql执行效率低下。
