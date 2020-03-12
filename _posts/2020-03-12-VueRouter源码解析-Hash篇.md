---
layout: post
title: 'VueRouter源码解析-Hash篇'
date: 2020-03-12
author: 'Yeqiang'
tags:
  - JS
---

一直都想着分析下 Vue 相关工具的源码，最近终于抽出时间了，就先从 VueRouter 开始吧。  
看到源码的时候还是有点惊讶的，没想到所有代码都放在一个文件里，一共 2600 多行，一看还是有点吓人的。不过很多都是辅助函数，我们主要分析主流程的代码就行。  
首先是最核心的，VueRouter 方法

```js
var VueRouter = function VueRouter(options) {
  if (options === void 0) options = {}

  this.app = null
  this.apps = []
  this.options = options
  this.beforeHooks = []
  this.resolveHooks = []
  this.afterHooks = []
  this.matcher = createMatcher(options.routes || [], this)

  var mode = options.mode || 'hash'
  this.fallback =
    mode === 'history' && !supportsPushState && options.fallback !== false
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base)
      break
    default: {
      assert(false, 'invalid mode: ' + mode)
    }
  }
}
```

这里主要的功能是创建了路由匹配，初始化生命周期钩子函数，以及根据环境创建相应的历史记录列表。  
首先我们来看`createMatcher`这个方法

```js
```
