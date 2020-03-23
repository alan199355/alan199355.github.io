---
layout: post
title: 'VueRouter源码解析-路由更改'
date: 2020-03-23
author: 'Yeqiang'
tags:
  - JS
---

上一篇文章大概了解了 VueRouter 的路由匹配部分，大概的流程就是根据传入的路由配置，生成路由映射，路径映射等，然后在路由更改时判断是否是已定义的路由，进行相应的操作。那路由更改这一步具体是怎么操作的，这篇文章就来探讨下这个问题。  
我们都知道 VueRouter 有 3 种路由模式，Hash，H5，Node 环境，为方便起见，就以 Hash 为例。定义在`src/history/hash.js`

```js
// this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  setupListeners () {
    const router = this.router
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      setupScroll()
    }

    window.addEventListener(
      supportsPushState ? 'popstate' : 'hashchange',
      () => {
        const current = this.current
        if (!ensureSlash()) {
          return
        }
        this.transitionTo(getHash(), route => {
          if (supportsScroll) {
            handleScroll(this.router, route, current, true)
          }
          if (!supportsPushState) {
            replaceHash(route.fullPath)
          }
        })
      }
    )
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
```

主要看这两个方法，一个是根据当前设备是否支持设置相应的事件监听器，在路由改变后调用`this.transitionTo`方法，而`push`方法也是一样，只是`push`方法的路由是传入的。那我们就继续来看下`transitionTo`方法，代码定义在`src/history/base.js`

```js
```
