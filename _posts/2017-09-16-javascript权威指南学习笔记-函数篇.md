---
layout:     post
title:      "javascript权威指南学习笔记"
subtitle:   " 函数篇"
date:       2017-09-16 
author:     "Yeqiang"
tags:
    - JavaScript
---
## javascript权威指南学习笔记
* `this`没有作用域的限制，嵌套的函数不会从调用它的函数中继承this。如果嵌套函数作为方法调用，`this`的值指向调用它的对象，如果作为函数调用，`this`的值为全局对象(非严格模式)或undefined(严格模式)，比如
```
    var o = {
        m: function() {
            var self = this;
            console.log(this === o);    //true
            f();
            function f() {
                console.log(this === o);    //false,应为全局对象或undefined
                console.log(self === o);    //true
            }
        }
    }；
    o.m()
```
