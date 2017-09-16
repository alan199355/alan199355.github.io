## javascript权威指南学习笔记

* `Object.create(null)`会创建一个没有原型的新对象，该对象不继承任何东西，甚至不包括基础方法，如果想创建一个普通的空对象，则是`Object.create(Object.prototype)`,可使用该方法实现继承
* `hasOwnProperty()`检测给定的名字是否是对象的自有属性，对于继承属性则返回false，`propertyIsEnumerable()`只有检测到是自有属性且该属性的可枚举性为true时才返回true，通常由js代码创建的属性都是可枚举的
* `Object.keys()`返回对象中可枚举的自有属性的名称的数组，`Object.getOwnPropertyNames()`返回对象中所有自有属性的名称的数组
* `getter`和`setter`称为存取器属性，存取器属性不具有可写性，如果属性同时具有`getter`和`setter`属性，那么它是一个读/写属性，如果只有`getter`方法，就是只读属性，只有`setter`属性，就是只写属性，读取只写属性总是返回underfined
* 数据属性的描述符对象的属性有value、writable、enumerable、configurable。`Object.getOwnPropertyDescriptor()`可以获得某个对象特定属性的属性描述符(只能获得自有属性)，要获得继承属性的特性，需要遍历原型链，通过`Object.getPrototypeOf()`
* 要设置属性的特性，或要让新建属性具有某种特性，需要调用`Object.defineProperty()`
> var o={};<br>
> Object.defineProperty(o,'x',{value:1,writable:true,enumerable:false,configurable:true})
* 原型属性是用来继承属性的