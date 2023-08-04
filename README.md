# 碧蓝档案 monorepo

项目采用 rush.js 组织 monorepo, 统一各个项目的代码规范和依赖, 优化引入项目公用包形式

## 项目启动

太长不看版

```bash
npm install -g @microsoft/rush
rush update # 在 blue-archive 根目录下执行，下同
rush update-autoinstaller --name rush-prettier
rush install
rush build
```

1. 使用 node 版本 符合 `rush.json` 中的要求, 推荐 18
2. 全局安装 rush.js `npm install -g @microsoft/rush`
3. 解决 json with comment https://jingyan.baidu.com/article/b24f6c82042b95c7bfe5dad6.html
4. 全局安装`lerna@^6`
5. 进入`lib/pixi-spine` 使用 `npm install --save-dev lerna@^6` 安装 `lerna`, 然后使用`lerna bootstrap && lerna run build`打包魔改版`pixi-spine`
6. 使用 `rush update` 安装所有依赖, 执行 `rush build` 全量打包所有项目
7. `rush update-autoinstaller --name rush-prettier` 安装 prettier git hook, eslint 暂时依靠手动 ctrl + s 进行
8. 进入某个项目目录, `pnpm dev` 启动即可进行开发
