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