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

### 