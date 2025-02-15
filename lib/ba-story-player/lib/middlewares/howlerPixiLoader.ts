import { Howl } from "howler";
import { LoaderParserPriority, ExtensionType } from "pixi.js";

export const HowlerLoader = {
  extension: {
    name: "Howler Loader",
    priority: LoaderParserPriority.Normal,
    type: ExtensionType.LoadParser,
  },
  test(url: string) {
    return /\.(mp3|wav|ogg|mpeg)$/i.test(url);
  },

  async load(url: string) {
    return new globalThis.Promise((resolve, reject) => {
      const howl = new Howl({
        src: [url],
        preload: true,
        onload: () => resolve(howl),
        onloaderror: (_, message) => reject(message),
      });
    });
  },
  unload(asset: Howl) {
    asset.unload();
  },
};
