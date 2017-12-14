---
layout:     post
title:      "Javascript设计模式"
date:       2017-11-16
author:     "Yeqiang"
tags:
    - JavaScript
---
### 单例模式
单例模式的核心就是确保只有一个实例，并提供全局访问.  

```
var getSingle=function(){
    var result;
    return result || (result=fn.apply(this,arguments))
}
```

### 策略模式
策略模式的定义就是：定义一系列的算法，把他们一个个封装起来，并且使它们可以相互替换

### 代理模式
代理模式就是为一个对象提供一个代用品或占位符，以便控制对它的访问  
1.保护代理，过滤一些不合理的请求  
2.虚拟代理，把一些开销很大的对象，延迟到需要的时候再创建