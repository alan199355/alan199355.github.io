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

### 迭代器模式

1.内部迭代器 2.外部迭代器

### 发布-订阅模式

```
var Event=(function(){
    var global=this,
        Event,
        _default='default';
    Event=function(){
        var _listen,
            _trigger,
            _remove,
            _slice=Array.prototype.slice,
            _shift=Array.prototype.shift,
            _unshift=Array.prototype.unshift,
            namespaceCache={},
            _create,
            find,
            each=function(ary,fn){
                var ret;
                for(var i=0,l=ary.length;i<l;i++){
                    var n=ary[i];
                    ret=fn.call(n,i,n);
                }
                return ret;
            };
            _listen=function(key,fn,cache){
                cache[key]=cache[key]||[];
                cache[key].push(fn);
            };
            _remove=function(key,cache,fn){
                if(cache[key]){
                    if(fn){
                        for(var i=cache[key].length;i>=0;i--){
                            if(cache[key][i]===fn){
                                cache[key].splice(i,1);
                            }
                        }
                    }else{
                        cache[key]=[];
                    }
                }
            };
            _trigger=function(){
                var cache=_shift.call(arguments),
                    key=_shift.call(arguments),
                    args=arguments,
                    _self=this,
                    ret,
                    stack=cache[key];
                if(!stack || !stack.length){
                    return;
                };
                return each(stack,function(){
                    return this.apply(_self,args);
                })
            };
            _create=function(namespace){
                var namespace=namespace || _default;
                var cache={},
                    offlineStack=[],
                    ret={
                        listen:function(key,fn,last){
                            _listen(key,fn,cache);
                            if(offlineStack===null){
                                return;
                            }
                            if(last==='last'){
                                offlineStack.length && offlineStack.pop()();
                            }else{
                                each(offlineStack,function(){
                                    this();
                                });
                            }
                            offlineStack=null;
                        },
                        one:function(key,fn,last){
                            _remove(key,cache);
                            this.listen(key,fn,last);
                        },
                        remove:function(key,fn){
                            _remove(key,cache,fn);
                        },
                        trigger:function(){
                            var fn,
                                args,
                                _self=this;
                            _unshift.call(arguments,cache);
                            args=arguments;
                            fn=function(){
                                return _trigger.apply(_self,args);
                            };
                            if(offlineStack){
                                return offlineStack.push(fn);
                            }
                            return fn();
                        }
                    };
                    return namespace?(namespaceCache[namespace]?namespaceCache[namespace]:namespaceCache[namespace]=ret):ret;
            };
            return {
                create:_create,
                one:function(key,fn,last){
                    var event=this.create();
                    event.one(key,fn,last);
                },
                remove:function(key,fn){
                    var event=this.create();
                    event.remove(key,fn);
                },
                listen:function(key,fn,last){
                    var event=this.create();
                    event.listen(key,fn,last);
                },
                trigger:function(){
                    var event=this.create();
                    event.trigger.apply(this.arguments);
                }
            };
    }()
    return Event;
})()
```

### 命令模式
命令模式的常用场景是：有时候需要向某些对象发送请求，但是不知道请求的接收者是谁，也不知道被请求的操作是什么，希望有一种方式可以使请求发送者和请求接收者消除彼此之间的耦合关系。  
跟许多其他语言不同， JavaScript 可以用高阶函数非常方便地实现命令模式。命令模式在 JavaScript 语言中是一种隐形的模式

### 组合模式
组合模式将对象组合成树形结构，以表示“部分整体”的层次结构。 除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性  
以宏命令为例，请求从树最顶端的对象往下传递，如果当前处理请求的对象是叶对象（普通
子命令），叶对象自身会对请求作出相应的处理；如果当前处理请求的对象是组合对象（宏命令），组合对象则会遍历它属下的子节点，将请求继续传递给这些子节点  
注意点：
1. 组合模式不是父子关系  
2. 对叶对象操作的一致性  
3. 双向映射关系  
4. 用职责链模式提高组合模式性能
### 模板方法模式

### 享元模式

### 职责链模式

### 中介者模式

### 装饰者模式

### 状态模式

### 适配器模式
