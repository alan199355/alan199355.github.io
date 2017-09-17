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
* 调用js函数的时候，都会创建一个新的对象来保存局部变量，将该对象添加至作用域链中。当函数返回时，就将对象从作用域链中删除。如果不存在嵌套的函数，也没有其它引用指向这个绑定对象，会作为垃圾回收。如果定义了嵌套的函数，每个嵌套的函数都各自对应一个作用域链，并且这个作用域链指向一个变量绑定对象。但如果这些嵌套的函数对象在外部函数中保存下来，那么他们也会和所指向的变量绑定对象一样作为垃圾回收。但如果这个函数定义了嵌套的函数，并将它作为返回值返回或存储在某处的属性里，就会有一个外部引用指向这个嵌套的函数，就不会被当作垃圾回收。
* `arguments.length`(实际传入的实参个数)<br/>`arguments.callee.length`(期望传入的实参个数)
