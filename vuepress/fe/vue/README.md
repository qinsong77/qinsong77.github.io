---
title: Vue
---


### 面试题
- [「面试题」20+Vue面试题整理](https://juejin.cn/post/6844904084374290446)
- [大厂高频Vue面试题（上）](https://juejin.cn/post/6844904138208182285)
- [30 道 Vue 面试题，内含详细讲解](https://juejin.cn/post/6844903918753808398)
- [记录面试中一些回答不够好的题（Vue 居多） | 掘金技术征文](https://juejin.cn/post/6844903569422811150)
- [Vue 项目性能优化 — 实践指南（网上最全 / 详细）](https://juejin.cn/post/6844903913410314247)
- [揭秘 Vue.js 九个性能优化技巧](https://juejin.cn/post/6922641008106668045) -- 面试应该能用得上
### [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)

### [Vue源码全解](https://juejin.im/post/6846687602679119885)

### [核心响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

 ![An image](./image/vue1.png)

> vue采用数据劫持结合观察者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时通知订阅者(watcher)，触发相应的监听回调。
> 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。
Dep 对象用于依赖收集，它实现了一个观察者模式，完成了数据 Data 和渲染视图 Watcher 的订阅


[vue MVVM原理](https://juejin.cn/post/6844903586103558158)

[图解 Vue 响应式原理](https://juejin.cn/post/6857669921166491662)

[Vue 的响应式更新粒度](https://juejin.cn/post/6844904113432444942)
##### 总结
 - 1、在beforeCreate和created之间调用initState(vm)方法， 获取data并遍历,调用observe方法，ob = new Observer(value)进行依赖收集和派发更新
 - 2、在Observer中调用defineReactive使用defineProperty进行get和set操作，defineReactive中var dep = new Dep();
 Object.defineProperty 在getter时if (Dep.target) 则执行 dep.depend()即Dep.target.addDep(this);setter的时候dep.notify()派发更新。
 - 3、在beforeMount和mounted之间new Watcher(),watcher实例化的时候，会执行this.get()方法，把Dep.target赋值为当前渲染watcher并压入栈(为了恢复用),具体是`new`的时候执行
 `this.get()`,然后这个get先执行 `pushTarget(this);`然后执行`this.getter.call(vm, vm)`, 这个`getter`是`new`的时候赋值的`updateComponent`函数，里面执行了render组件的方法。
 接着执行vm._render()方法，生成渲染VNode,并且在这个过程中对vm上的数据访问，这个时候就触发了数据对象的getter(执行了Dep.target.addDep(this)方法，
 将watcher订阅到这个数据持有的dep的subs中，为后续数据变化时通知到拉下subs做准备).然后递归遍历添加所有子项的getter。
 

 ![An image](./image/vue3.png)
 
 - [从观察者模式到响应式的设计原理](https://mp.weixin.qq.com/s/FewKP2UTfbDzDxJMjoe62A)
 
 观察者模式实现自动更新： 
 1. 创建主题对象
 2. 添加观察者
 3. 通知观察者
 
![](./image/vue_observer.png)
 
 ::: details 点击查看代码
```javascript
  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }
  
  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
        warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

/* 依赖dep */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if (!config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

/*  */

// watcher调用
  new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);

  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

 /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if (!config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }

```
:::

##### 如何实现this.key 访问到vm._data.key的
`initData`初始化data函数中调用`proxy(vm, "_data", key)`;

```javascript
function noop (a, b, c) {}
var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
```

### [v-model](https://segmentfault.com/a/1190000015848976)

就是`<input type="text" v-model="message">`变成了

```vue
<input type="text" :value="message" @input="if($event.target.composing)return;message =$event.target.value">
```
`event.target.composing`用于判断此次input事件是否是`IME`构成触发的，如果是`IME`构成，直接`return`。`IME` 是输入法编辑器(Input Method Editor) 的英文缩写，IME构成指我们在输入文字时，处于未确认状态的文字。
### template是如何编译成render function的？

Vue提供了两个版本，一个是Runtime+Compiler版本的，一个是Runtime only版本的。Runtime+Compiler是包含编译代码的，可以把编译过程放在运行时来做。而Runtime only是不包含编译代码的，所以需要借助webpack的vue-loader来把模版编译成render函数。

编译主要有三个过程：
- 1.解析模版字符串生成AST

AST（在计算机科学中，抽象语法树（abstract syntax tree或者缩写为AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。）
```javascript
  var ast = parse(template.trim(), options);
```
parse 会用正则等方式解析 template模板中的指令、class、style等数据，形成AST树。AST是一种用Javascript对象的形式来描述整个模版，整个parse的过程就是利用正则表达式来顺序地解析模版，当解析到开始标签，闭合标签，文本的时候会分别对应执行响应的回调函数，从而达到构造AST树的目的。

举个例子：
```html
<div :class="c" class="demo" v-if="isShow">
    <span v-for="item in sz">{{item}}</span>
</div>
```
经过一系列的正则解析，会得到的AST如下：
 ::: details 点击查看代码
```javascript
 {
    /* 标签属性的map，记录了标签上属性 */
    'attrsMap': {
        ':class': 'c',
        'class': 'demo',
        'v-if': 'isShow'
    },
    /* 解析得到的:class */
    'classBinding': 'c',
    /* 标签属性v-if */
    'if': 'isShow',
    /* v-if的条件 */
    'ifConditions': [
        {
            'exp': 'isShow'
        }
    ],
    /* 标签属性class */
    'staticClass': 'demo',
    /* 标签的tag */
    'tag': 'div',
    /* 子标签数组 */
    'children': [
        {
            'attrsMap': {
                'v-for': "item in sz"
            },
            /* for循环的参数 */
            'alias': "item",
            /* for循环的对象 */
            'for': 'sz',
            /* for循环是否已经被处理的标记位 */
            'forProcessed': true,
            'tag': 'span',
            'children': [
                {
                    /* 表达式，_s是一个转字符串的函数 */
                    'expression': '_s(item)',
                    'text': '{{item}}'
                }
            ]
        }
    ]
}
```
 :::
当构造完AST之后，下面就是优化这颗AST树。
- 2.optimize：优化AST语法树
```javascript
optimize(ast, options)
```
为什么此处会有优化过程？Vue是数据驱动，是响应式的，但是template模版中并不是所有的数据都是响应式的，也有许多数据是初始化渲染之后就不会有变化的，那么这部分数据对应的DOM也不会发生变化。后面有一个 update 更新界面的过程，在这当中会有一个 patch 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。
```javascript
 /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize (root, options) {
    if (!root) { return }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }
```
可以看到，optimize实际上就做了2件事情，一个是调用markStatic()来标记静态节点，另一个是调用markStaticRoots()来标记静态根节点。

- 3.code generate：将优化后的AST树转换成可执行的代码(主要功能就是根据 AST 结构拼接生成 render 函数的字符串。通过`new Function`生成可运行的`render function`)。
 ::: details render function中有with的原因
```javascript
function render () {
  with (this) {
    return _c('div',{on:{"click":change}},[_c('span',[_v(_s(number))]),_v(" "),_c('span',     [_v(_s(name))])])
  }
}
```
 vue并没有对模板中的javascript表达式进行ast语法分析，如果要移除with，就需要对javascript表达式进行ast语法分析，并且还需要一个专门的解释器对ast语法树进行解释，这样就会导致存在两个并行的解析器，这样维护成本高，还可能会有潜在的bug风险。所以呢，作者并没有想做这个事情，麻烦费力不讨好
 
 :::

```javascript
 var code = generate(ast, options);
```
**template模版经历过parse->optimize->code generate三个过程之后，就可以得到render function函数了。**

[Vue.js源码角度：剖析模版和数据渲染成最终的DOM的过程](https://juejin.cn/post/6844903664998416392)
 ::: details 点击查看代码
```javascript
  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  var createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
  ) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
      optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  });    

  function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
      function compile (
        template,
        options
      ) {
        var finalOptions = Object.create(baseOptions);
        var errors = [];
        var tips = [];

        var warn = function (msg, range, tip) {
          (tip ? tips : errors).push(msg);
        };

        if (options) {
          if (options.outputSourceRange) {
            // $flow-disable-line
            var leadingSpaceLength = template.match(/^\s*/)[0].length;

            warn = function (msg, range, tip) {
              var data = { msg: msg };
              if (range) {
                if (range.start != null) {
                  data.start = range.start + leadingSpaceLength;
                }
                if (range.end != null) {
                  data.end = range.end + leadingSpaceLength;
                }
              }
              (tip ? tips : errors).push(data);
            };
          }
          // merge custom modules
          if (options.modules) {
            finalOptions.modules =
              (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            );
          }
          // copy other options
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        finalOptions.warn = warn;

        var compiled = baseCompile(template.trim(), finalOptions);
        {
          detectErrors(compiled.ast, warn);
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled
      }

      return {
        compile: compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }

```
:::

### this.$set() 与this.$del

- 判断是数组则调用splice方法触发响应式更新
- 对象则调用`defineReactive$$1`设置getter和setter,并通过target获取初始化时的`Observer`及`__ob__`对象，调用`ob.dep.notify()`通知更新。

**注意这个`__ob__`中dep怎么添加的**

`observe(data)`方法中`new Observer(value)`(value及data), new的时候这里也`new Dep()`，这个和`defineReactive$$1`中建的dep不一样，执行` def(value, '__ob__', this);`把`__ob__`定义个对象和数组，
而这个`__ob__`中的dep怎么添加watcher的？在`defineReactive$$1`调用`var childOb = !shallow && observe(val);`获取ob，然后在getter中
```javascript
get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend(); // !!!!这里
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
```

 ::: details 点击查看代码
```javascript
  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

```
:::

### 数组响应式变化原理
> 使用`Object.create`复制Array的原型对象prototype得到arrayMethods, 遍历一个7个数组方法的数组，包括`push,pop,shift,unshift,splice,sort，reverse`
>这些能改变数组的方法,使用函数劫持，在遍历时使用`Object.defineProperty`重写复制的原型对象arrayMethods对应方法的value,即重写方法，使用Array.prototype
>的原函数方法`apply`获取并返回结果，同时通过`var ob = this.__ ob__`获取Observer,调用`ob.dep.notify()`，通知更新；
>在Observe构造函数中，判断如果data的value如果是数组，1、如果该数组有`__proto__`属性，则直接把arrayMethods赋值给`__proto__`
>2、如果没有，则调用copyAugment，遍历arrayMethods把方法直接赋值给该数组
>3、遍历该数组，递归调用`observe`方法`new Observer`进行依赖收集
 ::: details 点击查看代码
```javascript

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });


  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) { // 数组的处理
      if (hasProto) { //   var hasProto = '__proto__' in {};
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys); // var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };
  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }
```
    
:::
### [Vue中$nextTick源码解析](https://juejin.im/post/6844904147804749832)

[更详细的讲解](https://juejin.cn/post/6891309786290192391)

[Vue为何采用异步渲染](https://www.cnblogs.com/WindrunnerMax/p/14429426.html)
>Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。
>这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
>Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
>vue更新Dom也会把更新队列添加到nextTick中去执行

::: tip 总结描述
 事件循环是在执行执行完宏任务后（script是第一个宏任务），执行完所有的微任务，在执行GUI渲染，然后开启事件队列中的下一个宏认为。
 当执行this.xx = 'xx' 时，背后更新Dom的回调会加到callback数组中，当执行完脚本，会执行微任务队列，这时就会遍历callback运行所有的回调函数。
:::
 
 ::: details 点击查看代码
```javascript
  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
```
:::

### [生命周期](https://juejin.im/post/6844904114879463437)
- [生命周期](https://juejin.im/post/6844903780736040973)
 ![An image](./image/vue2.png)
 
  ![An image](./image/vue_life_circle.png)
 
- `initLifecycle(vm);initEvents(vm);initRender(vm);`，`initLifecycle`：初始化参数，找到父节点，设置子节点，`$refs`为空数组，初始化组件变量，`_isMounted`，`_isDestroyed`等，
 `initEvents`：初始化事件，如果 _parentListeners 存在的话，更新组件的事件监听；
- `beforeCreate`之前合并配置，初始化生命周期，初始化事件中心，初始化渲染
- `created`之前调用`initInjections`，`initState`, `initProvide`，初始化 data、props、computed、watcher；
- `beforeMount`（渲染dom前）：判断`$options`中是否有挂载el，即检查是否有渲染位置。有的话执行`vm.$mount(vm.$options.el)`，注意这个`$mount()`执行的是11879行的方法，先`var mount = Vue.prototype.$mount;`保存之前的，在最后`mount.call(this, el, hydrating)`,
在$mount()中，会判断`options`是否有render，没有就开始编译模板，模板parse,optimize,generate,后得到render的字符串表达式，通过`new Function`生成`render function`
- 接着到`mountComponent`,`callHook(vm, 'beforeMount');`
- 执行了 `beforeMount` 钩子函数后，为组件`new Watcher`, 在 `new Watcher` 的时候，其实就是执行了`updateComponent`,调用了` _render` 方法得到Vdom, `_update`中patch，实现了 `dom` 的渲染，即在执行完 `vm._update()` 把 VNode patch 到真实 DOM 后，执行 `mounted` 钩子。
- `beforeUpdate`: 实际上是在`watcher.run()`之前调用了`watcher.before();`触发了这个beforeUpdate，其他没做什么。**数据更新时调用，发生在虚拟 DOM 打补丁之前。**，beforeUpdate是针对视图层，视图层的数据发生改变才会触发(废话，只有访问了数据的get才会收集依赖)
- 在watcher.run之后调用了`callUpdatedHooks`, 因为有多个组件的时候，会有很多个 watcher ，在这里，就是检查当前的得 watcher 是哪个，是当前的话，就直接执行当前 updated 钩子。
- beforeDestroy（卸载组件前）: 在卸载前，检查是否已经被卸载，如果已经被卸载，就直接 return 出去；执行 `beforeDestroy` 钩子
- destroyed前： 从父级组件那里删除自己，`vm._watcher.teardown()` 拆解观察者，把所有有关自己痕迹的地方，都给删除掉。
```javascript
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }
```
 ::: details 点击查看代码
```javascript
Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      var startTag, endTag;
      /* istanbul ignore if */
      if (config.performance && mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if (config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
```
:::

### 抽象组件
常用的`transition`和`keep-alive`就是一个抽象组件。抽象组件是无状态的，同样也是“不存在的”，它自己并不会被渲染为实际的`DOM`，而是直接返回以及操作它的子元素。

### vue函数式组件functional
什么是函数式组件: 没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法，它只是一个接受一些 `prop` 的函数。简单来说是 **一个无状态和无实例的组件**

函数式组件和普通的对象类型的组件不同，是通过`createFunctionalComponent`创建，它不会被看作成一个真正的组件，在 `patch` 过程中，如果遇到一个节点是组件 `vnode`，会递归执行子组件的初始化过程；而函数式组件的 `render` 生成的是普通的 `vnode`，不会有递归子组件的过程，因此渲染开销会低很多。
因此，函数式组件也不会有状态，不会有响应式数据，生命周期钩子函数这些东西。可以把它当成把普通组件模板中的一部分 `DOM` 剥离出来，通过函数的方式渲染出来，是一种在 `DOM` 层面的复用。

```javascript
Vue.component('my-component', {
  functional: true,
  // Props 是可选的
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function(createElement, context) {
    // ...
  }
})

```
或者单文件定义函数式组件（2.5版本后）

```vue
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners">
    <slot/>
  </button>
</template>
```
```javascript
function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }
 
    var baseCtor = context.$options._base;
 
    // 省略N行
    // functional component
    if (isTrue(Ctor.options.functional)) { // 在此判断是否是函数式组件，如果是return 自定义render函数返回的Vnode，跳过底下初始化的流程
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }
    // 省略N行
    // install component management hooks onto the placeholder node
    installComponentHooks(data); // 正常的组件是在此进行初始化方法（包括响应数据和钩子函数的执行）
 
    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );
 
    return vnode
  }
```
正是因为函数式组件精简了很多例如响应式和钩子函数的处理，因此渲染性能会有一定的提高，所以如果业务组件是一个纯展示且不需要有响应式数据状态的处理的，那函数式组件会是一个非常好的选择。


和正常自定义组件的区别？

- 不维护响应数据
- 无钩子函数
- 没有instance实例, 所以在组件内部没有办法像传统组件一样通过this来访问组件属性

在一些展示组件。例如， `buttons`， `tags`, `cards`，或者页面是静态文本，就很适合使用函数式组件。

该应用于以下场景：
- 需要通过编程实现在多种组件中选择一种。
- children、props 或者 data 在传递给子组件之前，处理它们。

### [插槽和作用域插槽](https://cn.vuejs.org/v2/guide/components-slots.html)

具名插槽： 实际上就是实现组件children内容按name分发

#### [作用域插槽](https://mp.weixin.qq.com/s/58P3kkHOL-h-gkfcXTgAOA)
作用：让插槽内容能够访问子组件中的数据。

使用
- 子组件`v-bind`提供可访问的数据
- 在父组件中使用子组件时，插槽容器上通过slot-scope来接收 子组件中插槽抛出来的数据。自 2.6.0 起有所更新, 使用`v-slot`

**父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。**

[在 Vue 2.6 中](https://juejin.cn/post/6844904115886096392)
1. `slot` 和 `slot-scope` 在组件内部被统一整合成了 **函数**
2. 他们的渲染作用域都是 **子组件**
3. 并且都能通过 `this.$slotScopes`去访问

编译过程

1. 普通插槽

```vue
<!-- 场景设置 -->
<!-- 父组件 -->
<div>
    <test>我是slot中的内容</test>
</div>

<!-- 子组件:test -->
<main>
    我在子组件中
    <slot></slot>
</main>
```

父组件先解析，将`test`作为子组件处理，生成这样的节点
```
{
    tag: 'div',
    children: [{
        tag: 'test',
        children: ['插入slot中']
    }]
}
```

子组件解析，slot作为一个占位符，会被解析成一个函数

```
{
    tag: 'main',
    children: [
        '我在子组件里面',
        // 不传递插槽的名称默认就是default, 如果传了就是传入的名称
        _t('default')
    ]
}
```

2. 作用域插槽

```vue
<!-- 场景设置 -->
<!-- 父组件 -->
<div>
    <test>
        <template slot-scope="slotProps">
            插入slot中{{slotProps}}
        </template>
    </test>
</div>
<!-- 子组件:test -->
<main>
    我在子组件中
    <slot :child="child"></slot>
</main>

data() {
    return { child: 123 }
}
```

父组件先解析

````
{
    tag: 'div',
    children: [{
        tag: 'test',
        scopeSlots: {
            default(slotProps) {
                return ['插入slot中' + slotProps]
            }
        }
    }]
}
````

子组件解析，slot作为一个占位符，会被解析成一个函数

```
{
    tag: 'main',
    children: [
        '我在子组件中',
        // 这里的{ child: 123 }就是传递给插槽中的数据
        _t('default', { child: 123 })
    ]
}
```

最终会解析成

````
{
    tag: 'main',
    children: [
        '我在子组件里面', 
        '插入slot 中 {child:123}'
    ]
}
````

### computed和watch

- [Vue的Computed原理](https://juejin.cn/post/6844904120290131982)
- [手摸手带你理解Vue的Computed原理](https://juejin.cn/post/6844904199596015624)

在`initState`时`initComputed`和`initWatch`
- 1.实例上定义` _computedWatchers` 对象，用于存储“计算属性Watcher”;
- 2.获取计算属性的 `getter`，需要判断是函数声明还是对象声明;
- 3.创建“计算属性Watcher”，`getter` 作为参数传入，它会在依赖属性更新时进行调用，并对计算属性重新取值。需要注意 Watcher 的 lazy 配置，这是实现缓存的标识;
- 4.`defineComputed` 对计算属性进行数据劫持;

`computed`核心是`computedGetter`里的执行，获取缓存的`_computedWatchers`，具体如下：
```javascript
function computedGetter(){
	var watcher = this._computedWatchers && this._computedWatchers[key]
	if (watcher) {
		if (watcher.dirty) {
			watcher.evaluate()
		}
		if (Dep.target) {
			watcher.depend()
		}
		return watcher.value
	}
}

Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
};
```



watcher.dirty 是实现计算属性缓存的触发点，watcher.evaluate是对计算属性重新求值，依赖属性收集“渲染Watcher”，计算属性求值后会将值存储在 value 中，get 返回计算属性的值；
dirty为false返回上传的结果，为true执行`watcher.evaluate()`。实际上是`defineReactive`中的`get`方法的`dep.depend()`将`computed`的`watcher`推入依赖`data`的`dep`的`sub队列`中，这正是依赖data的修改可以触发`dirty=true`的原因

计算属性更新的路径
1. computed使用的响应式的值更新
2. 同时通知 `computed watcher` 和 `渲染 watcher` 更新
3. `computed watcher` 把 `dirty` 设置为 `true`
4. 视图渲染读取到 `computed` 的值，由于 `dirty` 所以 `computed watcher` 重新求值


ComputedWatcher 和普通 Watcher 的区别：
1. 用 `lazy` 为 `true` 标示为它是一个`计算Watcher`
2. `计算Watcher`的`get`和`set`是在初始化(initComputed)时经过 defineComputed() 方法重写了的
3. 当它所依赖的属性发生改变时虽然也会调用ComputedWatcher.update()，但是因为它的lazy属性为true，所以只执行把dirty设置为true这一个操作，并不会像其它的Watcher一样执行queueWatcher()或者run()
4. 当有用到这个ComputedWatcher的时候，例如视图渲染时调用了它时，才会触发ComputedWatcher的get，但又由于这个get在初始化时被重写了，其内部会判断dirty的值是否为true来决定是否需要执行evaluate()重新计算
5. 因此才有了这么一句话：当计算属性所依赖的属性发生变化时并不会马上重新计算(只是将dirty设置为了true而已)，而是要等到其它地方读取这个计算属性的时候(会触发重写的get)时才重新计算，因此它具备懒计算特性。

 ::: details 点击查看代码
```javascript
  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) { // 开始时初始化的dirty为true，执行evaluate，及执行watcher的get，这一步相当于，依赖的data的dep收集了这个watcher
          watcher.evaluate();
        }
        if (Dep.target) { // 收集了渲染watcher
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }
```
:::
### Vue中组件生命周期调用顺序
>组件的调用顺序都是**先父后子**,渲染完成的顺序是**先子后父**
>组件的销毁操作是先父后子，销毁完成的顺序是先子后父
- 加载渲染过程(在父组件mounted执行子组件beforeCreate到mounted的过程)
父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount- >子mounted->父mounted
- 子组件更新过程
父beforeUpdate->子beforeUpdate->子updated->父updated
- 父组件更新过程
父 beforeUpdate -> 父 updated
- 销毁过程
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
- 路由守卫beforeRouteEnter的next回调会在组件mounted后执行


### 视图渲染过程

![](./image/vue_view_render_process.png)

### [vue Diff](https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484449&idx=1&sn=7f346b97a177218cc09fc50562ed121c&chksm=f9a66e3dced1e72b8a88fd0d78b5a5b8bd2e0ec95552e675d44923d368bba2ec438c520cd7be&token=946193943&lang=zh_CN#rd)

[vue2.0的diff算法详解](https://www.jianshu.com/p/92a7496af50c)

[深入剖析：Vue核心之虚拟DOM](https://juejin.cn/post/6844903895467032589)

对比 oldVnode 和 vnode(`patch`)
- 1、没有旧节点
> 没有旧节点，说明是页面刚开始初始化的时候，此时，根本不需要比较了，直接全部都是新建，所以只调用 `createElm`
- 2、旧节点 和 新节点 自身一样（不包括其子节点）
> 通过 `sameVnode` 判断节点是否一样，旧节点 和 新节点自身一样时，直接调用 `patchVnode` 去处理这两个节点;
> 当两个Vnode自身一样的时候，我们需要做什么？
  首先，自身一样，我们可以先简单理解，是 Vnode 的两个属性 `tag` 和 `key` 一样;
  那么，我们是不知道其子节点是否一样的，所以肯定需要比较子节点;
   所以，`patchVnode`其中的一个作用，就是比较子节点。
- 3、旧节点 和 新节点自身不一样
> 当两个节点不一样的时候，不难理解，直接创建新节点，删除旧节点

```javascript
  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }
```

在 Vue3 中将采用另外一种核心 Diff 算法，它借鉴于 ivi 和 inferno。

在进行 Dom Diff 算法之前，先进行预处理过程，将公共的首尾提取出来。

- 队首比较`oldChild[first] = newChild[first]`。
  - 如果一致则，指针指向下一节点。
  - 如果不一致，则执行 vue2 的双端比较。
- 队尾比较`oldChild[last] = newChild[last]`。
  - 如果一致则，指针指向下一节点。
  - 如果不一致，则执行 vue2 的双端比较。
  
双端比较时的优化：

- 判断是否有节点需要移动，将需要移动的节点加入 source 数组中。
- 根据 source 数组计算出一个最长递增子序列（计算出最小的移动）。
- 移动 Dom 操作。

##### patchVnode(比较两个Vnode 的子节点)

总的来说，这个函数的作用是
- 1、Vnode 是文本节点，则更新文本（文本节点不存在子节点）

- 2、Vnode 有子节点，则处理比较更新子节点, 此时有3种情况。
  -  1、新旧节点 都有子节点，而且不一样,调用`updateChildren`（细节很多）
  
  -  2、只有新节点(不用比较，直接创建出所有新DOM，并且添加进父节点的)
  
  -  3、只有旧节点(把所有的旧节点删除,也就是直接把DOM 删除)

两个节点值得比较时，会调用patchVnode函数
```javascript
function patchVnode (oldVnode, vnode){
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        }else if (ch){
            createEle(vnode) //create el's children dom
        }else if (oldCh){
            api.removeChildren(el)
        }
    }
}
```

`const el = vnode.el = oldVnode.el` 这是很重要的一步，让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化。

节点的比较有5种情况:

- 1. `if (oldVnode === vnode)`，他们的引用一致，可以认为没有变化。

- 2. `if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)`，文本节点的比较，需要修改，则会调用`Node.textContent = vnode.text`。

- 3. `if( oldCh && ch && oldCh !== ch )`, 两个节点都有子节点，而且它们不一样，这样我们会调用updateChildren函数比较子节点，这是diff的核心，见下[updateChildren](#updatechildren)。

- 4. `else if (ch)`，只有新的节点有子节点，调用`createEle(vnode)`，vnode.el已经引用了老的dom节点，createEle函数会在老dom节点上添加子节点。

- 5. `else if (oldCh)`，新节点没有子节点，老节点有子节点，直接删除老节点。

  
#### Vue中key属性的作用
>当 Vue.js 用`v-for`正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。————官方文档

[用 index 做为 key](https://zhuanlan.zhihu.com/p/124019708)

### updateChildren

过程可以概括为：`oldCh`和`newCh`各有两个头尾的变量`StartIdx`和`EndIdx`，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了`key`，就会用`key`进行比较，在比较的过程中，变量会往中间靠，一旦`StartIdx>EndIdx`表明`oldCh`和`newCh`至少有一个已经遍历完了，就会结束比较。

- 1. 旧节点`oldStartVnode`或`oldEndVnode`为`undefined`或null，这index++
- 2. 新旧开始和结束节点比较，四种情况其实是指定key的时候，判定为同一个VNode，则直接patchVnode即可，分别比较oldCh以及newCh的两头节点2*2=4种情况
  - oldStartVnode === newStartVnode =》 patchVnode
  - oldEndVnode === newEndVnode =》 patchVnode
  - oldStartVnode === newEndVnode =》 pathVode 并且，newEndVode移动到右边，即把旧的开始节点插入到旧的结束节点后面
  - oldEndVnode === newStartVnode =》 pathVode 并且，newEndVode移动到左边，即把旧的结束节点插入到旧的开始节点前面
  - 生成一个key与旧VNode的key对应的哈希表， 如果找不到key，则创建插入，找到的话如果是相同的节点，则patchNode并且插入，不是则创建插入
- while结束时，如果是oldStartIdx > oldEndIdx，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实DOM中。
newStartIdx > newEndIdx，则说明新节点已经遍历完了，老节点多余新节点，这个时候需要将多余的老节点从真实DOM中移除

 ::: details 点击查看代码
```javascript
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, elmToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        /*前四种情况其实是指定key的时候，判定为同一个VNode，则直接patchVnode即可，分别比较oldCh以及newCh的两头节点2*2=4种情况*/
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        /*
          生成一个key与旧VNode的key对应的哈希表（只有第一次进来undefined的时候会生成，也为后面检测重复的key值做铺垫）
          比如childre是这样的 [{xx: xx, key: 'key0'}, {xx: xx, key: 'key1'}, {xx: xx, key: 'key2'}]  beginIdx = 0   endIdx = 2  
          结果生成{key0: 0, key1: 1, key2: 2}
        */
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        /*如果newStartVnode新的VNode节点存在key并且这个key在oldVnode中能找到则返回这个节点的idxInOld（即第几个节点，下标）*/
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
        if (isUndef(idxInOld)) { // New element
          /*newStartVnode没有key或者是该key没有在老节点中找到则创建一个新的节点*/
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          /*获取同key的老节点*/
          elmToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            /*如果elmToMove不存在说明之前已经有新节点放入过这个key的DOM中，提示可能存在重复的key，确保v-for的时候item有唯一的key值*/
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            /*Github:https://github.com/answershuto*/
            /*如果新VNode与得到的有相同key的节点是同一个VNode则进行patchVnode*/
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            /*因为已经patchVnode进去了，所以将这个老节点赋值undefined，之后如果还有新节点与该节点key相同可以检测出来提示已有重复的key*/
            oldCh[idxInOld] = undefined
            /*当有标识位canMove实可以直接插入oldStartVnode对应的真实DOM节点前面*/
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          } else {
            // same key but different element. treat as new element
            /*当新的VNode与找到的同样key的VNode不是sameVNode的时候（比如说tag不一样或者是有不一样type的input标签），创建一个新的节点*/
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      /*全部比较完成以后，发现oldStartIdx > oldEndIdx的话，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实DOM中*/
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      /*如果全部比较完成以后发现newStartIdx > newEndIdx，则说明新节点已经遍历完了，老节点多余新节点，这个时候需要将多余的老节点从真实DOM中移除*/
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
```
 ::: 

![](./image/updateChildren.png)

![](./image/vdom_diff.jpg)

### [Vue.js的computed和watch是如何工作的](https://juejin.cn/post/6844903667884097543)

### [keep-alive原理](https://juejin.im/post/6862206197877964807)

### [虚拟 DOM 到底是什么？(长文建议收藏)](https://mp.weixin.qq.com/s/oAlVmZ4Hbt2VhOwFEkNEhw)
### [探索Virtual DOM的前世今生](https://zhuanlan.zhihu.com/p/35876032)
### [让虚拟DOM和DOM-diff不再成为你的绊脚石](https://juejin.cn/post/6844903806132568072)
### [面试官: 你对虚拟DOM原理的理解?](https://juejin.cn/post/6844903902429577229)
### [详解vue的diff算法](https://juejin.cn/post/6844903607913938951)

### [Vue.extend](https://zhuanlan.zhihu.com/p/342643253)

### [实现双向绑定Proxy比defineProperty优劣如何](https://juejin.cn/post/6844903601416978439)
### [为什么Vue3.0不再使用defineProperty实现数据监听？](https://mp.weixin.qq.com/s/O8iL4o8oPpqTm4URRveOIA)

### 数据改变到页面渲染的过程是怎么样的？
- 看下面的图片👇，这是执行click函数改变一个数据之后发生的函数调用栈，从图上的说明可以比较清楚个了解这个响应式过程的大概流程。下面简单讲解一下：
- 改变数据，触发这个被劫持过的数据的setter方法
- 执行这个数据的订阅中心（dep）的notify方法
- update方法里执行queueWatcher方法把watcher推入队列
- 执行nextTick方法开始更新视图
- run方法里设置dep.target为当前订阅对象
- 调用get方法调用当前watcher的getter执行更新方法
- updateComponent方法里调用了render方法开始执行渲染页面
- patch、patchVnode、updateChildren方法都是比较VNode更新渲染的函数，不过重点的diff过程在updateChildren方法里。

 ![An image](./image/vue4.png)
 
### [vue模板渲染--compile](https://www.jianshu.com/p/743166a8968c)

![](./image/vue_render.png)

### [手写Vue-router核心原理](https://juejin.im/post/6854573222231605256)

### [SPA 路由](https://juejin.im/post/6895882310458343431)
#### hash 
hash 是 URL 中 hash (#) 及后面的那部分，常用作锚点在页面内进行导航，改变 URL 中的 hash 部分不会引起页面刷新

通过 `hashchange` 事件监听 URL 的变化, 页面第一次加载完不会触发 `hashchange`，可以使用`window.addEventListener('DOMContentLoaded', ()=>{})`，改变 URL 的方式只有这几种：
1. 通过浏览器前进后退改变 URL;
2. 通过`<a>`标签改变 URL;
3. 通过`window.location`改变URL。

[DOMContentLoaded和load的区别](https://www.cnblogs.com/gg-qq/p/11327972.html)

`DOMContentLoaded` 事件在 html文档加载完毕，并且 html 所引用的内联 js、以及外链 js 的同步代码都执行完毕后触发。

当页面 DOM 结构中的 js、css、图片，以及 js 异步加载的 js、css 、图片都加载完成之后，才会触发 `load` 事件。
```html
<!DOCTYPE html>
<html lang="en">
<body>
<ul>
    <ul>
        <!-- 定义路由 -->
        <li><a href="#/home">home</a></li>
        <li><a href="#/about">about</a></li>

        <!-- 渲染路由对应的 UI -->
        <div id="routeView"></div>
    </ul>
</ul>
</body>
<script>
    let routerView = routeView
    window.addEventListener('hashchange', ()=>{
        let hash = location.hash;
        routerView.innerHTML = hash
    })
    window.addEventListener('DOMContentLoaded', ()=>{
        if(!location.hash){//如果不存在hash值，那么重定向到#/
            location.hash="/"
        }else{//如果存在hash值，那就渲染对应UI
            let hash = location.hash;
            routerView.innerHTML = hash
        }
    })
</script>
</html>

```
#### history
history 提供了 `pushState` 和 `replaceState` 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新;

history 提供类似 `hashchange` 事件的 `popstate` 事件，但 `popstate` 事件有些不同：

1. 通过浏览器前进后退改变 URL 时会触发 popstate 事件
2. 通过pushState/replaceState或`<a>`标签改变 URL 不会触发 popstate 事件。
3. 好在我们可以拦截 pushState/replaceState的调用和`<a>`标签的点击事件来检测 URL 变化，通过js 调用history的back，go，forward方法课触发该事件

```html
<!DOCTYPE html>
<html lang="en">
<body>
<ul>
    <ul>
        <li><a href='/home'>home</a></li>
        <li><a href='/about'>about</a></li>

        <div id="routeView"></div>
    </ul>
</ul>
</body>
<script>
    let routerView = routeView
    window.addEventListener('DOMContentLoaded', onLoad)
    window.addEventListener('popstate', ()=>{
        routerView.innerHTML = location.pathname
    })
    function onLoad () {
        routerView.innerHTML = location.pathname
        var linkList = document.querySelectorAll('a[href]')
        linkList.forEach(el => el.addEventListener('click', function (e) {
            e.preventDefault()
            history.pushState(null, '', el.getAttribute('href'))
            routerView.innerHTML = location.pathname
        }))
    }

</script>
</html>

```

### Vuex

[vuex工作原理详解](https://www.jianshu.com/p/d95a7b8afa06)

本质上Vuex是在内部生成了一个Vue实例，state即是这个vm的data。

这样就能解释了为什么vuex中的state的对象属性必须提前定义好，如果该state中途增加一个属性，因为该属性没有被defineReactive，所以其依赖系统没有检测到，自然不能更新。
在vue中`this.$store._vm.$data.$$state === this.$store.state`

在`resetStoreVM`中试下了响应式更新。getter的缓存机制也是借助`computed`实现。
 ::: details 点击查看代码
```javascript
  function applyMixin (Vue) {
    var version = Number(Vue.version.split('.')[0]);

    if (version >= 2) {
      Vue.mixin({ beforeCreate: vuexInit });
    } else {
      // override init and inject vuex init procedure
      // for 1.x backwards compatibility.
      var _init = Vue.prototype._init;
      Vue.prototype._init = function (options) {
        if ( options === void 0 ) options = {};

        options.init = options.init
          ? [vuexInit].concat(options.init)
          : vuexInit;
        _init.call(this, options);
      };
    }

    /**
     * Vuex init hook, injected into each instances init hooks list.
     */

    function vuexInit () {
      var options = this.$options;
      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
    }
  }
  function resetStoreVM (store, state, hot) {
    var oldVm = store._vm;

    // bind store public getters
    store.getters = {};
    // reset local getters cache
    store._makeLocalGettersCache = Object.create(null);
    var wrappedGetters = store._wrappedGetters;
    var computed = {};
    forEachValue(wrappedGetters, function (fn, key) {
      // use computed to leverage its lazy-caching mechanism
      // direct inline function use will lead to closure preserving oldVm.
      // using partial to return function with only arguments preserved in closure environment.
      computed[key] = partial(fn, store);
      Object.defineProperty(store.getters, key, {
        get: function () { return store._vm[key]; },
        enumerable: true // for local getters
      });
    });

    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    var silent = Vue.config.silent;
    Vue.config.silent = true;
    store._vm = new Vue({
      data: {
        $$state: state
      },
      computed: computed
    });
    Vue.config.silent = silent;

    // enable strict mode for new vm
    if (store.strict) {
      enableStrictMode(store);
    }

    if (oldVm) {
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(function () {
          oldVm._data.$$state = null;
        });
      }
      Vue.nextTick(function () { return oldVm.$destroy(); });
    }
  }
```
 ::: 
 为什么`mutation`要是同步写法，其实这是常见的软件工程模式，及约定大于配置，实际测试，mutation里面也是可以异步执行的，但是这样就代表不可控，且develop tool也不好跟踪。
 加action是因为要区分可追踪，不可追踪。mutation绝对可以追踪，action不追踪。action中最后必须调用mutation的commit方法；action的作用1.告诉你这个不可追踪2.这个是异步 至于异步竞争/顺序，这些自己控制。
### [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)
### [8k字 | Redux/react-redux/redux中间件设计实现剖析](https://juejin.cn/post/6844904036013965325)

### 打包懒加载

路由使用`import`导入，并声明`webpackChunkName`
```javascript
const routes = [{
    path: '/',
    name: 'Home',
    // 将子组件加载语句封装到一个function中，将function赋给component
    component: () => import( /* webpackChunkName: "home" */ '../views/Home.vue')
  }
]
```
原理
 - 将需要进行懒加载的子模块打包成独立的文件（`children chunk`）；借助的是es6的`import`
 - 借助函数来实现延迟执行子模块的加载代码；

#### [Vue CLI 是如何实现的](http://axuebin.com/articles/fe-solution/cli/vuecli.html)

### [vue-loader原理分析](https://mp.weixin.qq.com/s/Pvxr0A-aDoitL1UAokTSnQ)

### Vue组件name属性总结

```vue
export default {
  name: 'xxx',
  components: {}
}
```
1. 当项目使用`keep-alive`时，可搭配组件`name`进行缓存过滤
2. 递归组件时
3. vue-devtools调试工具里显示的组件名称是由vue中组件name决定的
