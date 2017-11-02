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
同步的loaders会返回一个转换后的模块的值。在更多复杂的情况下，
