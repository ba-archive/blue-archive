# 碧蓝档案 monorepo

简体中文 | [English](README_EN.md)

项目采用 `rush.js` 组织 monorepo, 统一各个项目的代码规范和依赖, 优化引入项目公用包形式

## 环境信息

- 当前 rush 版本：`5.112.1`
- 推荐 node 版本：`20` （测试可用版本：`v20.7.0`）
- 项目包管理器版本信息：`pnpm@latest` （测试可用版本：`8.10.5`）

## 配置教程

**安装 node20（推荐使用 [nvm](https://github.com/nvm-sh/nvm)）**

> 对于 windows 系统推荐先安装 [scoop](https://scoop.sh/)，然后使用 scoop 安装 nvm，最后使用 nvm 安装 node

```powershell
# windows
# 安装 scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser # Optional: Needed to run a remote script the first time
irm get.scoop.sh | iex

# 安装 nvm
scoop install nvm

# 安装 node
nvm install 20
nvm use 20
```

**安装 rush**

```bash
# 安装 pnpm
npm install -g pnpm
pnpm install -g @microsoft/rush
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

## 正确的使用 eslint 和 lint-staged

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
