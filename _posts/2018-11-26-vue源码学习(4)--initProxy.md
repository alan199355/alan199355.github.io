---
layout: post
title: "vue源码学习(4)-initProxy"
date: 2018-11-19
author: "Yeqiang"
tags:
  - JS
---



现在我们继续回到`src/core/instance/init.js`里，接下来是这一段

```js
/* istanbul ignore else */
if (process.env.NODE_ENV !== "production") {
  initProxy(vm);
} else {
  vm._renderProxy = vm;
}
```

`initProxy`的源码定义在`src/core/instance/proxy.js`中

```js
const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)

  if (hasProxy) {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    has (target, key) {
      const has = key in target
      const isAllowed = allowedGlobals(key) || key.charAt(0) === '_'
      if (!has && !isAllowed) {
        warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      const options = vm.$options
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
```

首先判断是否支持 Proxy，如果支持，会使用 proxy 代理模式修改`config.keyCodes`属性，防止覆盖内置的修饰符。然后会判断是否有 render 对象且 render 对象是否有*withStripped 属性，如果都有那就使用 getHandler 函数，否则调用 hasHandler 函数。不过\_withStripped 属性只有在写测试的时候才会为 true，具体代码在`test/unit/features/instance/render-proxy.spec.js`  
getHandler 函数的作用是在调用 vm 对象的某个属性的时候，如果该属性是字符串类型且无法在 vm 内部找到时会报错，不然就返回该属性的值。举例来说，就是你在 template 中使用了{{a}}，但是你没有在 data 中定义 a，就会报这个错。  
hasHandler 函数会在遍历 vm 对象的时候触发，有两个判断条件：首先是当前属性是否存在 vm 对象上，以及是否是全局关键字比如 Math，Number 之类或者是否以*开头。当两个条件都为 false 时，会触发 warnNonPresent 报错。其实这个和 getHandler 里的判断差不多，都是在 template 里使用了未定义的变量或方法时会报错。
最后总结，如果当前环境 Proxy 可用，那么 vm.\_renderProxy 就是对于 vm 本身的一个代理，不然的话 renderProxy 就赋值为 vm 本身。  
现在我们回到 init.js 中，继续主流程。

```js
// expose real self
vm._self = vm;
initLifecycle(vm);
initEvents(vm);
initRender(vm);
callHook(vm, "beforeCreate");
initInjections(vm); // resolve injections before data/props
initState(vm);
initProvide(vm); // resolve provide after data/props
callHook(vm, "created");
```

首先是将 vm 本身通过\_self 属性暴露出来。然后进行初始化生命周期、初始化事件、初始化，调用生命周期钩子等。  
我们先看下`initLifecycle(vm)`，这段代码定义于`src/core/instance/lifecycle.js`中

```js
export function initLifecycle(vm: Component) {
  const options = vm.$options;

  // locate first non-abstract parent
  let parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
```

这个方法比较简单，首先获取当前实例的$options属性，然后通过递归找到当前组件的第一个非抽象的父组件，所谓抽象就类似于`<keep-alive>`：组件本身不会渲染一个dom元素，也不会出现在父组件链中。找到第一个非抽象父组件之后就把当前实例push到父组件的\$children属性中。之后都是一些赋值操作，这些属性的作用如下
|  名称  |  说明  |
| ----- | ----- |
|$parent | 指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 this.$parent 访问父实例，子实例被推入父实例的$children 数组中。 |
| $root | 当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己 |
|$children | 当前实例的直接子组件。需要注意 $children 并不保证顺序，也不是响应式的 |
|$refs | 一个对象，持有已注册过 ref 的所有子组件 |
| \_watcher | 组件实例相应的 watcher 实例对象 |
| \_inactive | 表示 keep-alive 中组件状态，如被激活，该值为 false,反之为 true |
| \_directInactive | 也是表示 keep-alive 中组件状态的属性 |
| \_isMounted | 当前实例是否完成挂载(对应生命周期图示中的 mounted) |
| \_isDestroyed | 当前实例是否已经被销毁(对应生命周期图示中的 destroyed) |
| \_isBeingDestroyed | 当前实例是否正在被销毁,还没有销毁完成(介于生命周期图示中 deforeDestroy 和 destroyed 之间) |
`initLifeCycle(vm)`之后是`initEvents(vm)`函数，这个函数定义在`src/core/instance/events.js`中
```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```
首先将vm.\_events属性赋值成一个空对象，`Object.create(null)`方法生成的对象不仅本身的值为空，且原型链上的属性和方法都没有。然后将\_hasHookEvent属性置为false，这个属性是判断是否有通过hook模式绑定的事件。然后是判断`_parentListeners`属性，这个属性是表示父组件绑定在当前组件上的事件，如果有就执行`updateComponentListeners`方法
```js
function add (event, fn, once) {
  if (once) {
    target.$once(event, fn)
  } else {
    target.$on(event, fn)
  }
}

function remove (event, fn) {
  target.$off(event, fn)
}
export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, vm)
  target = undefined
}
```
首先是将vm赋值给target保持对vm的引用，然后执行`updateListeners`方法，在看它之前我们先看下add，remove这两个参数，其实主要就是看下`$once`，`$on`，`$off`这三个方法。
```js
const hookRE = /^hook:/
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    if (fn) {
      // specific handler
      let cb
      let i = cbs.length
      while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }
```
`$on`方法首先判断传入的events是否为数组，如果为数组，那么就遍历数组并递归调用`$on`方法，以确保传入的是字符串。然后将`vm.\_events[event]`置为数组并把fn传入。如果有通过hook方式绑定的方法，则把`\_hasHookEvent`属性置为true。最后返回实例对象。  
`$once`方法调用了`$on`方法，通过在回调函数中调用`$off`方法实现了只执行一次的结果。  
`$off`方法和`$on`方法一样，会判断events是否为数组，如果是就遍历递归调用。确保传入的是字符串。之后会判断这个事件的监听器，如果没有就不做操作。之后判断回调函数，如果不传回调，就移除所有监听器，如果传入了回调，就移除这个回调的监听器。之后统一返回实例对象。  
现在我们在看看`updateListeners`这个方法
```js
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) {
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)
    /* istanbul ignore if */
    if (__WEEX__ && isPlainObject(def)) {
      cur = def.handler
      event.params = def.params
    }
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params)
    } else if (cur !== old) {
      old.fns = cur
      on[name] = old
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
```