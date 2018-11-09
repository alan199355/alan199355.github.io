---
layout:     post
title:      "javascript深拷贝及浅拷贝"
date:       2017-10-10 
author:     "Yeqiang"
tags:
    - JavaScript
---
## javascript深拷贝及浅拷贝

栈内存：保存基本类型，包括underfined null boolean number string,占有固定大小的空间 <br>
堆内存：保存引用类型，包括Array Object Date RegExp Function，在栈内存中保存对象的访问地址，然后到堆内存中分配空间。<br>
所以当我们访问引用类型时，会先到栈内存中找到访问地址，再到堆内存中获取值。

### 浅拷贝
拷贝引用，拷贝后都是指向同一个对象的实例，会影响相互的操作，比如`Array.prototype.slice()`、`Array.prototype.concat()`、`$.extend({},obj)`
```
var a={person:{name:'alan'}};
var b=$.extend({},a);
console.log(a===b); // false,说明两个对象分别指向不同的实例
b.person.name='111';
console.log(a.person.name);// 111，说明内部的引用都是同一个引用
```

### 深拷贝
```
let a={name:'alan',phone:{mobile:'1234'}};
function deepCopy(target){
    let result={};
    let keys=Object.keys(target),
        key=null,
        temp=null;
    for(i in keys){
        key=keys[i];
        temp=target[key];
        // 如果是对象则递归操作
        if(temp && typeof temp==='object'){
            result[key]=deepCopy(temp);
        }else{
        // 否则直接赋值
            result[key]=temp;
        }
    }
    return result;
}
let b=deepCopy(a);
b.phone.mobile='4321'
console.log(a.phone.mobile);// 1234，说明两个对象在内存中的引用是不同的
```
