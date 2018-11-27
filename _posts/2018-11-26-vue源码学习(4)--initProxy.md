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
