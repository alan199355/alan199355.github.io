---
layout: post
title: "vue源码学习-响应式原理(4)-nextTick"
date: 2019-03-07
author: "Yeqiang"
tags:
  - JS
---
之前在`queueWatcher`方法里提到了`nextTick`方法
```js
 nextTick(flushSchedulerQueue)
```
接下来我们就来看看它的具体实现。定义在`src/core/util/next-tick.js`中。
```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
在`nextTick`这个方法中，涉及到了微任务及宏任务相关的知识。根据注释来看，在2.4版本之前都是用的微任务，但是在有些场景下微任务的权重太高，可能会在连续的事件之间触发，甚至是在同一事件的冒泡过程中。但是全都用宏任务也有问题，比如状态刚好在重绘之前改变。所以vue默认使用微任务，但是暴露出方法在需要的时候强制使用宏任务，也就是`withMacroTask`方法。  
回到代码，在宏任务的选择上，首先判断`setImmediate`是否可用，不过这个方法只在高版本的IE中才能用。如果不可用就判断`MessageChannel`是否可用，再不行就使用`setTimeout`。在微任务的选择上，首先判断`promise`是否可用，不行就和宏任务一样。  
继续往下，看到`nextTick`方法。首先将传入的回调函数`cb`推入`callbacks`数组。然后通过`useMacroTask`来判断是使用宏任务还是微任务，最终执行`flushCallbacks`方法。`flushCallbacks`方法的逻辑很简单，首先复制`callbacks`的数据，然后将原`callbacks`数组清空，最后遍历数组，依次执行回调函数。  
这里使用`callbacks`数组而不是直接在`nextTick`中执行回调是为了保证在同一个tick中多次执行`nextTick`时，不会开启多个异步任务，只会有一个异步任务。