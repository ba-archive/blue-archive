import {
  LoaderParserPriority,
  ExtensionType,
  ALPHA_MODES,
  settings,
  utils,
  BaseTexture,
  Assets,
  checkExtension,
} from "pixi.js";
import type { AssetExtension, Loader, UnresolvedAsset } from "pixi.js"
import { TextureAtlas } from "@esotericsoftware/spine-core";
import {
  SpineTexture,
  ISpineAtlasMetadata,
} from "@esotericsoftware/spine-pixi";
import type { Texture } from "@pixi/core";

type RawAtlas = string;

const spineTextureAtlasLoader: AssetExtension<
  RawAtlas | TextureAtlas,
  ISpineAtlasMetadata
> = {
  extension: ExtensionType.Asset,

  resolver: {
    test: (value: string): boolean => checkExtension(value, ".atlas"),
    parse: (value: string): UnresolvedAsset => {
      const split = value.split(".");
      return {
        resolution: parseFloat(settings.RETINA_PREFIX?.exec(value)?.[1] ?? "1"),
        format: split[split.length - 2],
        src: value,
      };
    },
  },

  loader: {
    extension: {
      type: ExtensionType.LoadParser,
      priority: LoaderParserPriority.High,
      name: "spineTextureAtlasLoader",
    },

    test(url: string): boolean {
      return checkExtension(url, ".atlas");
    },

    async load(url: string): Promise<RawAtlas> {
      const response = await settings.ADAPTER.fetch(url);

      const txt = await response.text();

      return txt;
    },

    testParse(asset: unknown, options: { src: string }): Promise<boolean> {
      const isExtensionRight = checkExtension(options.src, ".atlas");
      const isString = typeof asset === "string";

      return Promise.resolve(isExtensionRight && isString);
    },

    unload(atlas: TextureAtlas) {
      atlas.dispose();
    },

    async parse(
      asset: RawAtlas,
      options: { src: string; data: ISpineAtlasMetadata },
      loader: Loader
    ): Promise<TextureAtlas> {
      const metadata: ISpineAtlasMetadata = options.data || {};
      let basePath = utils.path.dirname(options.src);

      if (basePath && basePath.lastIndexOf("/") !== basePath.length - 1) {
        basePath += "/";
      }

      // Retval is going to be a texture atlas. However, we need to wait for its callback to resolve this promise.
      const retval = new TextureAtlas(asset);

      // If the user gave me only one texture, that one is assumed to be the "first" texture in the atlas
      if (
        metadata.images instanceof BaseTexture ||
        typeof metadata.images === "string"
      ) {
        const pixiTexture = metadata.images;
        metadata.images = {} as Record<string, BaseTexture | string>;
        metadata.images[retval.pages[0].name] = pixiTexture;
      }

      // we will wait for all promises for the textures at the same time at the end.
      const textureLoadingPromises = [];

      // setting preferCreateImageBitmap to false for loadTextures loader to allow loading PMA images
      let oldPreferCreateImageBitmap = true;
      for (const parser of loader.parsers) {
        if (parser.name == "loadTextures") {
          oldPreferCreateImageBitmap = parser.config?.preferCreateImageBitmap;
          break;
        }
      }
      Assets.setPreferences({ preferCreateImageBitmap: false });

      // fill the pages
      for (const page of retval.pages) {
        const pageName = page.name;
        const providedPage = metadata?.images
          ? metadata.images[pageName]
          : undefined;
        if (providedPage instanceof BaseTexture) {
          page.setTexture(SpineTexture.from(providedPage));
        } else {
          const url: string =
            providedPage ??
            utils.path.normalize(
              [...basePath.split(utils.path.sep), pageName].join(utils.path.sep)
            );
          const assetsToLoadIn = {
            src: url,
            data: {
              ...metadata.imageMetadata,
              ...{ alphaMode: page.pma ? ALPHA_MODES.PMA : ALPHA_MODES.UNPACK },
            },
          };
          const pixiPromise = loader
            .load<Texture>(assetsToLoadIn)
            .then(texture => {
              page.setTexture(SpineTexture.from(texture.baseTexture));
            });
          textureLoadingPromises.push(pixiPromise);
        }
      }

      await Promise.all(textureLoadingPromises);

      // restoring preferCreateImageBitmap old value for loadTextures loader
      Assets.setPreferences({
        preferCreateImageBitmap: oldPreferCreateImageBitmap,
      });

      return retval;
    },
  },
} as AssetExtension<RawAtlas | TextureAtlas, ISpineAtlasMetadata>;

type SkeletonJsonAsset = any;
type SkeletonBinaryAsset = Uint8Array;

function isJson(resource: any): resource is SkeletonJsonAsset {
  return resource.hasOwnProperty("bones");
}

function isBuffer(resource: any): resource is SkeletonBinaryAsset {
  return resource instanceof Uint8Array;
}

const spineLoaderExtension: AssetExtension<
  SkeletonJsonAsset | SkeletonBinaryAsset
> = {
  extension: ExtensionType.Asset,

  loader: {
    extension: {
      type: ExtensionType.LoadParser,
      priority: LoaderParserPriority.High,
    },

    test(url) {
      return checkExtension(url, ".skel");
    },

    async load(url: string): Promise<SkeletonBinaryAsset> {
      const response = await settings.ADAPTER.fetch(url);

      const buffer = new Uint8Array(await response.arrayBuffer());

      return buffer;
    },
    testParse(asset: unknown, options: { src: string }): Promise<boolean> {
      const isJsonSpineModel =
        checkExtension(options.src, ".json") && isJson(asset);
      const isBinarySpineModel =
        checkExtension(options.src, ".skel") && isBuffer(asset);

      return Promise.resolve(isJsonSpineModel || isBinarySpineModel);
    },
  },
} as AssetExtension<SkeletonJsonAsset | SkeletonBinaryAsset>;

export { spineTextureAtlasLoader, spineLoaderExtension };