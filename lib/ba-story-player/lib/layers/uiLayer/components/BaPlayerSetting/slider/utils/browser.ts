import { isClient, isIOS } from "@vueuse/core";

export { isClient, isIOS };

export const isFirefox = (): boolean =>
  isClient && /firefox/i.test(window.navigator.userAgent);
