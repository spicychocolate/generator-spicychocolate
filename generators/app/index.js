"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk"); // 让console带颜色输出
const yosay = require("yosay");
const mkdirp = require("mkdirp"); // 创建目录
const gitDownload = require("download-git-repo"); 
const del = require("del");
const path = require("path");
const fs = require("fs");
const ora = require("ora"); // loading效果
const gitUrl = require("../../package.json").gitUrl; // 模板文件git地址，可动态更新模板文件（只更新不涉及变量的文件可用）

const spinner = ora();

module.exports = class extends Generator {
  prompting() { 
    this.log(
      yosay(
        `Welcome to the pioneering ${chalk.red("generator-spicychocolate")} generator!`
      )
    );
    const prompts = [
      {
        type: "input",
        name: "project",
        message: "请输入项目名称",
        validate: input => {
          input = input.trim();
          if (input) {
            if (!/^[a-z]+$/.test(input)) {
              return chalk.red("请输入小写字母组成的名称");
            }
            const projectPath = `${this.destinationPath()}/spicy-${input}`;
            if (fs.existsSync(projectPath)) {
              return chalk.red(`spicy-${input}文件已存在`);
            }
            return true;
          }
          return chalk.red("项目名称不为空");
        }
      },
      {
        type: "input",
        name: "title",
        message: "请输入标题"
      },
      {
        type: "input",
        name: "body",
        message: "请输入内容"
      },
      {
        type: "confirm",
        name: "isInstall",
        message: "是否安装包？",
        default: true
      },
      {
        type: "list",
        name: "installType",
        message: "请选择安装方式",
        default: "yarn",
        choices: ["yarn", "npm"],
        when: props => {
          return props.isInstall;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      props.projectName = `spicy-${props.project}`;
      this.props = props;
    });
  }

  // 删除原有的模板文件，通过git拉取新的模板文件
  defaults() {
    spinner.text = chalk.green(`delete templates`);
    spinner.start();
    const delPath = this.templatePath().replace(/\\/g, "/");
    del.sync(delPath, { force: true });
    spinner.succeed();

    const done = this.async();
    spinner.text = chalk.green(`git clone ${gitUrl}`);
    spinner.start();
    const dirName = this.templatePath();
    gitDownload(`direct:${gitUrl}`, dirName, { clone: true }, err => {
      if (err) {
        this.log(chalk.red("\n 项目下载失败！"));
        spinner.fail();
        return;
      }
      spinner.succeed();
      done();
    });

    const { projectName } = this.props;
    mkdirp(projectName);
    this.destinationRoot(this.destinationPath(projectName));
  }

  // 写入文件，并替换模板中的ejs变量<%= x %>
  writing() {
    const { title, body } = this.props;
    const tplMap = {
      "index.html": { title, body },
    };
    const templateRoot = this.templatePath(".");
    this._walk(templateRoot, templateRoot, tplMap);
  }

  // 递归遍历模板项目
  _walk(filePath, templateRoot, tplMap) {
    if (fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach(name => {
          this._walk(path.resolve(filePath, name), templateRoot, tplMap);
      });
      return;
    }
    const relativePath = path.relative(templateRoot, filePath);
    const destination = this.destinationPath(relativePath);
    let templateOptions = tplMap[relativePath.replace(/\\/g, "/")] || {};
    this.fs.copyTpl(filePath, destination, templateOptions);
  }

  // 安装包
  install() {
    const { installType, isInstall } = this.props;
    if (isInstall) {
      this.installDependencies({
        yarn: installType === "yarn",
        bower: false,
        npm: installType === "npm"
      });
    }
  }

  end() {
    this.log(chalk.green("项目初始化成功"));
  }
};