/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Window {
  baStore?: any;
  baResource: any;
  baStory: any;
}
declare interface Document {
  webkitCancelFullScreen?: any;
  mozCancelFullScreen?: any;
  webkitFullscreenElement?: any;
  mozFullScreenElement?: any;
  fullscreenElement?: any;
  webkitFullscreenEnabled?: any;
  mozFullScreenEnabled?: any;
}

declare interface HTMLElement {
  webkitRequestFullScreen: any;
  mozRequestFullScreen?: any;
}
