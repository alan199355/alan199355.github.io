---
layout:     post
title:      "如何编写loader"
date:       2017-11-02
author:     "Yeqiang"
tags:
    - 前端
---
### 编写一个loader
loader是一个导出方法的node模块。这个方法会在使用这个loader转换资源的时候被调用。这个方法可以通过给定的`this`上下文来连接到[Loader API](https://doc.webpack-china.org/api/loaders/)。
### 设置
在我们深入各种loaders及它们的用法、例子之前，让我们先了解三种我们在本地编写和测试loader的方式。
为了测试单个loader，你可以在规则对象中用`path`来`resolve`一个本地文件。
<br>**webpack.config.js**
```
{
  test: /\.js$/
  use: [
    {
      loader: path.resolve('path/to/loader.js'),
      options: {/* ... */}
    }
  ]
}
```
为了测试多个loader，你可以使用`resolveLoader.modules`配置来更新数据，webpack会从这里去找到loaders。比如说，在你的项目里有个`loaders`文件夹：
<br>**webpack.config.js**
```
resolveLoader: {
  modules: [
    'node_modules',
    path.resolve(__dirname, 'loaders')
  ]
}
```
最后一点，如果你已经为你的loader创建了一个独立的仓库和包，你可以通过[npm link](https://docs.npmjs.com/cli/link)添加到你的项目中来进行测试。
### 简单的用法
当一个单独的loader应用到文件中时，这个loader仅通过一个参数被调用--一个包含这个文件全部内容的字符串。  
同步的loaders会返回一个转换后的模块的值。在更复杂的情况下，loader会通过`this.callback(err,values)`方法返回若干个返回值。在同步的loader中，错误消息会通过`this.callback`方法传递或者被throw。  
loader一般会返回1到2个值。第一个值是js代码的运行结果，以string或buffer的形式。第二个值是js对象的SourceMap。
### 复杂的用法
当多个loaders以链式调用时，需要重点记住loaders是以相反的顺序执行的，不管是从右向左或从下往上的形式。
- 最后一个loader，叫做第一个，会传入资源文件的原始值
- 第一个loader，叫做最后一个，应该返回js和可选的source map
- 中间的loader会根据之前的loader的结果来执行
因此，在下面的例子中，`foo-loader`会接收原始文件而`bar-loader`会接收`foo-loader`的输出然后返回最终转换后的模块并按需返回source map。
<br>**webpack.config.js**
```
{
  test: /\.js/,
  use: [
    'bar-loader',
    'foo-loader'
  ]
}
```
### 指导方针
在开发loader时，应当遵循下列方针。这些方针以重要性排序，其中一些只在特定的场景下适用，想了解更多请阅读详情部分。
- 保持loader**简单**
- 采用**链式**
- 导出**模块**
- 保证loader是**无状态的**
- 采用**loader共用**
- 注意**loader依赖**
- 解决**loader依赖**
- 提取**公共代码**
- 避免**绝对路径**
- 使用**同级依赖**
### 简单
loader应该只完成单个任务。这不仅让维护每个loader的工作更简单，同时也允许loaders在更多的场景为不同的需求以链式调用。
### 链式
必须注意到loaders是可以通过链式调用的。与其用一个loader处理5个任务，不如用5个loader分解工作量。将它们分割不仅让每个独立的loader保证简单，而且在有些场景下会以意想不到的方式调用。  
用通过loader options或query parameters来指定数据并渲染模板文件的功能举例。这个功能可以写成一个loader，这个loader从源文件编译模板、执行然后返回一个导出一段包含HTML代码的字符串的模块。