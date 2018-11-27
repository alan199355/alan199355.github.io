---
layout: post
title: "vue源码学习(5)-initLifecycle"
date: 2018-11-19
author: "Yeqiang"
tags:
  - JS
---

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

这个方法比较简单，首先获取当前实例的\$options 属性，然后通过递归找到当前组件的第一个非抽象的父组件，所谓抽象就类似于`<keep-alive>`：组件本身不会渲染一个 dom 元素，也不会出现在父组件链中。找到第一个非抽象父组件之后就把当前实例 push 到父组件的\$children 属性中。之后都是一些赋值操作，这些属性的作用如下
| 名称 | 说明 |
| ----- | ----- |
|$parent | 指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 this.$parent 访问父实例，子实例被推入父实例的$children 数组中。 |
|$root | 当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己 |
|$children | 当前实例的直接子组件。需要注意$children 并不保证顺序，也不是响应式的 |
|\$refs | 一个对象，持有已注册过 ref 的所有子组件 |
| \_watcher | 组件实例相应的 watcher 实例对象 |
| \_inactive | 表示 keep-alive 中组件状态，如被激活，该值为 false,反之为 true |
| \_directInactive | 也是表示 keep-alive 中组件状态的属性 |
| \_isMounted | 当前实例是否完成挂载(对应生命周期图示中的 mounted) |
| \_isDestroyed | 当前实例是否已经被销毁(对应生命周期图示中的 destroyed) |
| \_isBeingDestroyed | 当前实例是否正在被销毁,还没有销毁完成(介于生命周期图示中 deforeDestroy 和 destroyed 之间) |
`initLifeCycle(vm)`之后是`initEvents(vm)`函数，这个函数定义在`src/core/instance/events.js`中

```js
export function initEvents(vm: Component) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
```

首先将 vm.\_events 属性赋值成一个空对象，`Object.create(null)`方法生成的对象不仅本身的值为空，且原型链上的属性和方法都没有。然后将\_hasHookEvent 属性置为 false，这个属性是判断是否有通过 hook 模式绑定的事件。然后是判断`_parentListeners`属性，这个属性是表示父组件绑定在当前组件上的事件，如果有就执行`updateComponentListeners`方法

```js
function add(event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove(event, fn) {
  target.$off(event, fn);
}
export function updateComponentListeners(
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove, vm);
  target = undefined;
}
```

首先是将 vm 赋值给 target 保持对 vm 的引用，然后执行`updateListeners`方法，在看它之前我们先看下 add，remove 这两个参数，其实主要就是看下`$once`，`$on`，`$off`这三个方法。

```js
const hookRE = /^hook:/;
Vue.prototype.$on = function(
  event: string | Array<string>,
  fn: Function
): Component {
  const vm: Component = this;
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$on(event[i], fn);
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn);
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      vm._hasHookEvent = true;
    }
  }
  return vm;
};

Vue.prototype.$once = function(event: string, fn: Function): Component {
  const vm: Component = this;
  function on() {
    vm.$off(event, on);
    fn.apply(vm, arguments);
  }
  on.fn = fn;
  vm.$on(event, on);
  return vm;
};

Vue.prototype.$off = function(
  event?: string | Array<string>,
  fn?: Function
): Component {
  const vm: Component = this;
  // all
  if (!arguments.length) {
    vm._events = Object.create(null);
    return vm;
  }
  // array of events
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$off(event[i], fn);
    }
    return vm;
  }
  // specific event
  const cbs = vm._events[event];
  if (!cbs) {
    return vm;
  }
  if (!fn) {
    vm._events[event] = null;
    return vm;
  }
  if (fn) {
    // specific handler
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
  }
  return vm;
};
```

`$on` 方法首先判断传入的 events 是否为数组，如果为数组，那么就遍历数组并递归调用`$on`方法，以确保传入的是字符串。然后将`vm.\_events[event]`置为数组并把 fn 传入。如果有通过 hook 方式绑定的方法，则把`\_hasHookEvent`属性置为 true。最后返回实例对象。  
`$once`方法调用了`$on`方法，通过在回调函数中调用`$off`方法实现了只执行一次的结果。  
`$off`方法和`$on`方法一样，会判断 events 是否为数组，如果是就遍历递归调用。确保传入的是字符串。之后会判断这个事件的监听器，如果没有就不做操作。之后判断回调函数，如果不传回调，就移除所有监听器，如果传入了回调，就移除这个回调的监听器。之后统一返回实例对象。  
现在我们在看看`updateListeners`这个方法

```js
var normalizeEvent = cached(function(name) {
  var passive = name.charAt(0) === "&";
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === "~"; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === "!";
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns) {
  function invoker() {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments);
    }
  }
  invoker.fns = fns;
  return invoker;
}
export function updateListeners(
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (__WEEX__ && isPlainObject(def)) {
      cur = def.handler;
      event.params = def.params;
    }
    if (isUndef(cur)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `Invalid handler for event "${event.name}": got ` + String(cur),
          vm
        );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(
        event.name,
        cur,
        event.once,
        event.capture,
        event.passive,
        event.params
      );
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove(event.name, oldOn[name], event.capture);
    }
  }
}
```

首先遍历当前监听器的属性,这里的 name 其实就是 click，touchstart 之类的事件类型。获取到当前的事件类型的所绑定的方法  与之前的方法。如图所示:  
![updateListenes-1](/img/in-post/Vue/updateListener-1.jpeg)  
然后通过`normalizeEvent()`方法返回当前方法的一些特性。因为如果你使用了一些修饰符，你的 name 开头会带一些符号。最终返回的对象如图：  
![updateListenes-1](/img/in-post/Vue/updateListener-2.jpeg)  
之后会判断当前的事件类型所绑定的事件是否  为 undefined 或 null，是就报错，之后判断这是第一次绑定还是已经绑定过了，绑定过的话就直接替换，如果是第一次就通过`createFnInvoker()`方法将回调方法处理，最后通过 add，也就是`Vue.prototype.$on`方法绑定到`vm._events`上。
如果是之前有绑定方法，当前取消了绑定，那就通过`remove`方法移除回调。  
initEvents 的流程已经完了。现在我们继续回到 init.js 中。

```js
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

现在我们进行到了`initRender(vm)`这一步，这个方法定义在`src/core/instance/render.js`中。

```js
export function initRender(vm: Component) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== "production") {
    defineReactive(
      vm,
      "$attrs",
      (parentData && parentData.attrs) || emptyObject,
      () => {
        !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm);
      },
      true
    );
    defineReactive(
      vm,
      "$listeners",
      options._parentListeners || emptyObject,
      () => {
        !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm);
      },
      true
    );
  } else {
    defineReactive(
      vm,
      "$attrs",
      (parentData && parentData.attrs) || emptyObject,
      null,
      true
    );
    defineReactive(
      vm,
      "$listeners",
      options._parentListeners || emptyObject,
      null,
      true
    );
  }
}
```
