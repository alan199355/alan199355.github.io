---
layout: post
title: 'VueRouter源码解析-路由匹配'
date: 2020-03-12
author: 'Yeqiang'
tags:
  - JS
---

首先是最核心的，VueRouter 类

```js
export default class VueRouter {
  static install: () => void
  static version: string

  app: any
  apps: Array<any>
  ready: boolean
  readyCbs: Array<Function>
  options: RouterOptions
  mode: string
  history: HashHistory | HTML5History | AbstractHistory
  matcher: Matcher
  fallback: boolean
  beforeHooks: Array<?NavigationGuard>
  resolveHooks: Array<?NavigationGuard>
  afterHooks: Array<?AfterNavigationHook>

  constructor(options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash'
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
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }

  get currentRoute(): ?Route {
    return this.history && this.history.current
  }

  init(app: any /* Vue component instance */) {
    process.env.NODE_ENV !== 'production' &&
      assert(
        install.installed,
        `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
          `before creating root instance.`
      )

    this.apps.push(app)

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null
    })

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
    })
  }

  beforeEach(fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
  }

  beforeResolve(fn: Function): Function {
    return registerHook(this.resolveHooks, fn)
  }

  afterEach(fn: Function): Function {
    return registerHook(this.afterHooks, fn)
  }

  onReady(cb: Function, errorCb?: Function) {
    this.history.onReady(cb, errorCb)
  }

  onError(errorCb: Function) {
    this.history.onError(errorCb)
  }

  push(location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.push(location, resolve, reject)
      })
    } else {
      this.history.push(location, onComplete, onAbort)
    }
  }

  replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.replace(location, resolve, reject)
      })
    } else {
      this.history.replace(location, onComplete, onAbort)
    }
  }

  go(n: number) {
    this.history.go(n)
  }

  back() {
    this.go(-1)
  }

  forward() {
    this.go(1)
  }

  getMatchedComponents(to?: RawLocation | Route): Array<any> {
    const route: any = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute
    if (!route) {
      return []
    }
    return [].concat.apply(
      [],
      route.matched.map(m => {
        return Object.keys(m.components).map(key => {
          return m.components[key]
        })
      })
    )
  }

  resolve(
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location,
    route: Route,
    href: string,
    // for backwards compat
    normalizedTo: Location,
    resolved: Route
  } {
    current = current || this.history.current
    const location = normalizeLocation(to, current, append, this)
    const route = this.match(location, current)
    const fullPath = route.redirectedFrom || route.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
      location,
      route,
      href,
      // for backwards compat
      normalizedTo: location,
      resolved: route
    }
  }

  addRoutes(routes: Array<RouteConfig>) {
    this.matcher.addRoutes(routes)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
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

这个方法主要是用来判断当前路由是否匹配的，首先通过`normalizeLocation`方法生成当前路由的信息，这里的 raw 根据我结合上下文来看，应该有两种情况。一种是直接修改 url 并刷新或者使用 js 修改 hash，一种就是我们用的`this.$router.push()`。第一种情况，raw 的值应该就是当前的路径，而第二种就是 push 方法中传入的对象值。如果是通过修改 url 的方式，且当前 url 未被记录过，那就会走到`else if(location.path)`这一步，然后遍历路径列表，如果能存在该路径，则调用`_createRoute`方法。而如果是通过 push 方法或者该路径已存在，那就进入第一步。在这一步里其实也就是判断当前路由是否存在，如果存在，就根据之前生成的路由映射表获取该路由的参数，最终调用`_createRoute`方法

```js
function _createRoute(
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: Location
): Route {
  if (record && record.redirect) {
    return redirect(record, redirectedFrom || location)
  }
  if (record && record.matchAs) {
    return alias(record, location, record.matchAs)
  }
  return createRoute(record, location, redirectedFrom, router)
}
```

这个方法其实主要就是在未找到路由且设置了重定向的情况下，重定向到指定页面。如果确实存在该路由，则调用`createRoute`方法

```js
export function createRoute(
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}
```

这个方法是根据传入的路由记录，构建了一个路由对象，并将来源路由也带上，最终返回了这个路由对象。根据代码来看，路由的生成和匹配到这应该就结束了，但是在我们实际应用中路由改变后具体的流程是怎么样的，还需要从另一条线研究起。
