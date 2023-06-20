// @ts-nocheck
/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
// 声明自动引入的 vue 组件
// @ts-ignore
// @ts-ignore

import { App } from "vue";
import { Block } from "blockly";

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明 icons 引入的组件
declare module "~icons/*" {
  import { FunctionalComponent, SVGAttributes } from "vue";
  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}

// 声明 md 文件
declare module "*.md" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明 vite 环境变量
declare interface ImportMetaEnv {
  readonly VITE_BASE: string;
  readonly VITE_API_BASEURL: string;
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type SelectType = "friend";
interface ExtendBlock extends Block {
  data: SelectType | string;
}
interface Blocks {
  [key: string]: ExtendBlock;
}

declare global {
  module "blockly" {
    export * from "blockly/core/blockly";
    const Blocks: Blocks;
  }
}
