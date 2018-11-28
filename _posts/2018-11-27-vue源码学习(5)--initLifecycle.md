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

