interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

declare interface Document {
  startViewTransition?: (callback: () => void) => ViewTransition;
}
