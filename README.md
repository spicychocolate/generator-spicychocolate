# generator-spicychocolate 
> a generator for project

## Installation

First, install [Yeoman](http://yeoman.io) and generator-spicychocolate using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-spicychocolate
```

Then generate your new project:

```bash
yo spicychocolate
```

## 通过Yeoman生成脚手架
### 安装工具
```bash
npm install -g yo
npm install -g generator-generator // 脚手架生成工具
```
### 初始化项目
> 需要指定keywords为yeoman-generator, 或手动在package.json添加keywords

```bash
yo generator
```

生成的目录结构为:
```
generator-spicychocolate
├── LICENSE
├── README.md
├── __tests__
│   └── app.js
├── generators
│   └── app
│       ├── index.js
│       └── templates
│           └── dummyfile.txt
└── package.json
```

- `generators/app/templates/`是默认存放文件的目录，把所有模版文件放在这个目录下
- `/generators/app/index.js`是Yeoman的配置文件，定义如何生成脚手架

Yeoman生命周期如下
```javascript
initializing - 初始化函数
prompting - 接收用户输入阶段
configuring - 保存配置信息和文件
default - 执行自定义函数
writing - 生成项目目录结构阶段
conflicts - 统一处理冲突，如要生成的文件已经存在是否覆盖等处理
install - 安装依赖阶段
end - 生成器结束阶段
```
常用有initializing、prompting、default、writing、install四种生命周期


### 测试
在本地开发，使用npm link命令, 相当于在全局安装了此脚手架，然后在新文件夹中执行yo，选择脚手架，便可以测试

### 发布
```javascript 
npm set registry https://registry.npmjs.org/ // 设置源
npm adduser 
npm login 
npm publish // 发布，每次发布需更新package.json的版本号
```
[具体操作](https://greenfavo.github.io/blog/docs/04.html)
