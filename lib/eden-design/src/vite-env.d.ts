/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Document {
}

declare interface HTMLElement {
  webkitRequestFullScreen: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
}
