# 碧蓝档案剧情站

简体中文 | [English](README_EN.md)

## 子项目 (monorepos)

- Plana Studio - 碧蓝档案剧情编辑器 ([/apps/blue-archive-story-player](https://github.com/ba-archive/blue-archive/tree/dev-notype/apps/blue-archive-story-editor))
- blue-archive-story-viewer - 碧蓝档案剧情站 ([/apps/blue-archive-story-viewer](https://github.com/ba-archive/blue-archive/tree/main/apps/blue-archive-story-viewer))
- ba-online-toolbox - 在线翻译工具 ([/apps/ba-online-toolbox](https://github.com/ba-archive/blue-archive/tree/main/apps/ba-online-toolbox))
- Eden Design - 组件库 ([/lib/eden-design](https://github.com/ba-archive/blue-archive/tree/main/lib/eden-design))
- ba-story-player - 剧情播放器组件 ([/lib/ba-story-player](https://github.com/ba-archive/blue-archive/tree/main/lib/ba-story-player))


## 环境信息

项目采用 `rush.js` 组织 monorepo, 统一各个项目的代码规范和依赖, 优化引入项目公用包形式

- 当前 rush 版本：`5.120.6`
- 推荐 node 版本：`>=14 <=18` （测试可用版本：`v18.18.0`）
- 项目包管理器版本信息：`pnpm@latest` （测试可用版本：`9.0.6`）

## 配置教程

**安装 node18（推荐使用 [nvm](https://github.com/nvm-sh/nvm)）**

> linux 安装教程

```bash
# Linux
# 安装 nvm https://github.com/nvm-sh/nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 安装 node
nvm install 18
nvm use 18
```

> 对于 windows 系统推荐先安装 [scoop](https://scoop.sh/)，然后使用 scoop 安装 nvm，最后使用 nvm 安装 node

```powershell
# Windows
# 安装 scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser # Optional: Needed to run a remote script the first time
irm get.scoop.sh | iex

# 安装 nvm
scoop install nvm

# 安装 node
nvm install 18
nvm use 18
```

**安装 rush**

```bash
# 安装 pnpm
npm install -g pnpm
npm install -g @microsoft/rush
rush update # 在 blue-archive 根目录下执行，下同
# 编译项目、链接项目
rush build
```

## 常用命令

**对一个子库新增依赖**

> -m 将所有其他库的依赖保持一致

```bash
rush add -p <库名> [--dev] [-m]
```

**git commit 时禁用自动格式化 hook**

```bash
git commit -m "..." --no-verify
```

**更新依赖**

```base
rush add --make-consistent -p <库名>
```

## 项目结构

- `apps/` 应用程序目录
- `lib/` 库目录
- `lib/ba-rig` 此仓库的 rush-rig 包，详见：https://heft.rushstack.io/zh-cn/pages/intro/rig_packages/
- `lib/ba-story-player` 剧情播放器组件库

## ~~正确的使用 eslint 和 lint-staged~~

> deprecated 已过时

**eslint lint-staged 配置文件**

- `.eslintrc`
- `.eslintignore`
- `.lintstagedrc.mjs`
- `common/autoinstallers/rush-eslint/.eslintrc`
- `common/autoinstallers/rush-eslint/.lintstagedrc_base.mjs`

**全局 tsconfig**

- `lib/ba-rig/profiles/default/tsconfig-base.json`

## 正确使用 .vscode 文件夹

`.vscode` 文件夹内可以保存项目推荐的扩展，`settings.json` 还可以用来统一一些 vscode 设置，比如 typo 插件的词库。
