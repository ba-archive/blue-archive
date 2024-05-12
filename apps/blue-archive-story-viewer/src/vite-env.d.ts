/// <reference types="vite/client" />
import { QuicklinkOptions } from "@types/quicklink";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    webkitConvertPointFromNodeToPage?: (Node, WebkitPoint) => WebkitPoint;
    quicklink?: (options: QuicklinkOptions) => void;
  }
}
