---
layout:     post
title:      "翻译-如何编写loader"
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
用通过loader options或query parameters来指定数据源并渲染模板文件的功能举例。这个功能可以写成一个loader，这个loader从源文件编译模板、执行然后返回一个导出一段包含HTML代码的字符串的模块。然而，按照指导方针，可以用一个简单的`apply-loader`和其它的开源loader以链式的方法调用：  
- `jade-loader`:将模板转换成一个导出方法的模块
- `apply-loader`:根据loader options执行方法并返回原始的HTML
- `html-loader`:接收HTML并输出合法的JS模块。  
*loaders可以通过链式调用也意味着他们不需要必须输出JS。因为链式中的下一个loder可以处理它的输出，所以loader可以返回任何形式的模块*
### 模块化
保证输出模块化。loader产生的模块应该和正常的模块按照一样的设计原则。
### 无状态
保证loader在模块转换时没有状态。每次运行都应该是独立的。
### 公共loader
好好利用[loader-utils](https://github.com/webpack/loader-utils)包。它提供了许多有用的工具，但其中最重要的功能是能够返回传递给loader的参数。除了`loader-utils`，[schema-utils](https://github.com/webpack-contrib/schema-utils)包应该在loader的参数是完全的、合法的JSON结构的情况下使用。以下是一个简单的例子。  
**loader.js**
```
import { getOptions } from 'loader-utils';
import { validateOptions } from 'schema-utils';

const schema = {
  type: object,
  properties: {
    test: {
      type: string
    }
  }
}

export default function(source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  // Apply some transformations to the source...

  return export default ${ JSON.stringify(source) };
};
```
### loader依赖
如果一个loader引用了外部的资源（例如，读取文件），那就**必须**声明这一点。这个声明是为了在监听状态下停止缓存的loaders并重新编译。以下是一个简单的例子，如何用`addDependency`方法完成这个功能。  
**loader.js**
```
import path from 'path';

export default function(source) {
  var callback = this.async();
  var headerPath = path.resolve('header.js');

  this.addDependency(headerPath);

  fs.readFile(headerPath, 'utf-8', function(err, header) {
    if(err) return callback(err);
    callback(null, header + "\n" + source);
  });
};
```
### 模块依赖
根据模块的不同，可能有不同的方式来引用依赖。用CSS来举个例子，有`@import`和`url(...)`语句。这些依赖应该被模块系统所接收。  
这可以有以下两种方式：
- 都转换成`require`语句
- 使用`this.resolve`方法来接收路径
对第一个方法，`css-loader`是一个很好的例子，它使用`require`来引用依赖，在引用其它样式表时用`require`来替换`@import`，以及在引用其它文件时用`require`来替换`url(...)`  
以`less-loader`举例，它不能将每一个`@import`转换成`require`，因为所有的`.less`文件都在one pass for variables and mixin tracking 的情况下编译。因此，`less-loader`使用path resolving来延长less编译。然后再使用第二种方法，通过webpack使用`this.resolve`来解决依赖
### 共用代码
在loader运行过程中，避免在每一个模块中都生成同样的代码。相反的，创建一个运行时文件然后用`requrie`来引用它。
### 绝对路径
编译在模块代码中使用绝对路径，因为当项目的根目录更改时会破坏哈希值。
在`loader-utils`中有一个[stringifyRequest](https://github.com/webpack/loader-utils#stringifyrequest)方法可以将绝对路径转换成相对路径
### 同级依赖
如果你正在使用的loader只是对其它包进行了简单的包装，那你应该以`peerDependency`的形式将包包括进来。这个措施让应用的开发者在需要的情况下可以在`package.json`中修改成指定的版本。
举个例子，`sass-loader`指定[node-sass](https://github.com/webpack-contrib/sass-loader/blob/master/package.json)作为同级依赖，就像这样：
```
"peerDependencies": {
  "node-sass": "^4.0.0"
}
```
### 测试
现在你已经根据前面的指导意见写好了一个loader，并且在本地运行起来了。然后呢？让我们进行一个简单的单元测试来保证我们的loader可以按照我们的期望工作。我们将使用[Jest](https://facebook.github.io/jest/)框架来完成这个工作。