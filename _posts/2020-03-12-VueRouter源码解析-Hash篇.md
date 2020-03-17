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
function createMatcher(routes, router) {
  var ref = createRouteMap(routes)
  var pathList = ref.pathList
  var pathMap = ref.pathMap
  var nameMap = ref.nameMap

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }
  function match() {}
  function redirect() {}
  function alias() {}
  function _createRoute() {}
  return {
    match: match,
    addRoutes: addRoutes
  }
}
```

为方便阅读，这里的几个方法暂时省略，在稍候讲到的时候再具体分析。`createMatcher`这个方法主要是两个功能，一是返回匹配规则，一是根据我们配置的路由产生路由索引。  
我们先看看`createRouteMap`这个方法

```js
function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || []
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null)
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null)

  routes.forEach(function(route) {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}
```

这个方法主要返回了路径列表，路径索引，名称索引，并且保证通配符路由在路径列表的最后一项。同时遍历路由列表，为每一项路由添加记录。接下来我们来看看`addRouteRecord`这个方法

```js
function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
  var path = route.path
  var name = route.name
  {
    assert(path != null, '"path" is required in a route configuration.')
    assert(
      typeof route.component !== 'string',
      'route config "component" for path: ' +
        String(path || name) +
        ' cannot be a ' +
        'string id. Use an actual component instead.'
    )
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {}
  var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
        ? route.props
        : { default: route.props }
  }

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    {
      if (
        route.name &&
        !route.redirect &&
        route.children.some(function(child) {
          return /^\/?$/.test(child.path)
        })
      ) {
        warn(
          false,
          "Named Route '" +
            route.name +
            "' has a default child route. " +
            'When navigating to this named route (:to="{name: \'' +
            route.name +
            '\'"), ' +
            'the default child route will not be rendered. Remove the name from ' +
            'this route and use the name of the default child route for named ' +
            'links instead.'
        )
      }
    }
    route.children.forEach(function(child) {
      var childMatchAs = matchAs
        ? cleanPath(matchAs + '/' + child.path)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias]

    aliases.forEach(function(alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      }
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    })
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    } else if ('development' !== 'production' && !matchAs) {
      warn(
        false,
        'Duplicate named routes definition: ' +
          '{ name: "' +
          name +
          '", path: "' +
          record.path +
          '" }'
      )
    }
  }
}
```

这个方法其实就是遍历每一个路由，判断路由配置是否合法，并对正则匹配，大小写敏感等属性进行处理。如果存在子路由项，则递归遍历。其实在看上一个方法的时候，我一直在想 pathList，pathMap，nameMap 这些变量的值是哪来的，其实是在这个方法里。  
那么这一条线就走完了，归纳下，就是遍历路由项配置，生成路由记录，路径记录，路由索引等。  
接下来，继续回到`createMatcher`这个方法，之前说过这里还有几个方法还没有分析，现在我们来看下。首先看下 match 这个方法

```js
function match(raw, currentRoute, redirectedFrom) {
  var location = normalizeLocation(raw, currentRoute, false, router)
  var name = location.name

  if (name) {
    var record = nameMap[name]
    {
      warn(record, "Route with name '" + name + "' does not exist")
    }
    if (!record) {
      return _createRoute(null, location)
    }
    var paramNames = record.regex.keys
      .filter(function(key) {
        return !key.optional
      })
      .map(function(key) {
        return key.name
      })

    if (typeof location.params !== 'object') {
      location.params = {}
    }

    if (currentRoute && typeof currentRoute.params === 'object') {
      for (var key in currentRoute.params) {
        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
          location.params[key] = currentRoute.params[key]
        }
      }
    }

    if (record) {
      location.path = fillParams(
        record.path,
        location.params,
        'named route "' + name + '"'
      )
      return _createRoute(record, location, redirectedFrom)
    }
  } else if (location.path) {
    location.params = {}
    for (var i = 0; i < pathList.length; i++) {
      var path = pathList[i]
      var record$1 = pathMap[path]
      if (matchRoute(record$1.regex, location.path, location.params)) {
        return _createRoute(record$1, location, redirectedFrom)
      }
    }
  }
  // no match
  return _createRoute(null, location)
}
```

这个方法主要是用来判断当前路由是否匹配的，首先通过`normalizeLocation`方法生成当前路由的信息，这里的 raw 根据我结合上下文来看，应该有两种情况。一种是直接修改 url 并刷新或者使用 js 修改 hash，一种就是我们用的`this.$router.push()`。第一种情况，raw 的值应该就是当前的路径，而第二种就是 push 方法中传入的对象值。如果是通过修改 url 的方式，且当前 url 未被记录过，那就会走到`else if(location.path)`这一步，然后遍历路径列表，如果能存在该路径，则调用`_createRoute`方法。而如果是通过 push 方法或者该路径已存在，那就进入第一步。
