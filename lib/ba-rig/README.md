# BA 的 RIG

## RIG

在大规模的环境中，许多项目使用完全相同的 Heft 配置进行构建是有益的。可能存在一些细微差别——例如，一个 Node.js 项目可能需要输出 CommonJS 模块，而一个 web 应用程序项目可能需要输出 ESNext 模块。但通常，少数几个常见的"配置文件"（profile）就能涵盖大多数项目。@rushstack/rig-package 系统为将常见设置移入添加到消费它的项目的"devDependencies"中的 NPM 包提供了一种正式化的机制。这就叫做 rig package。注意，同一个 NPM 包可能产生几个不同的 rig profile；每个配置文件都是一个包含一组配置文件的文件夹。

## Links

- https://heft.rushstack.io/zh-cn/pages/intro/rig_packages/
- https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial
- https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig
