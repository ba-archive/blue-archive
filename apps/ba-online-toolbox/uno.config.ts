import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  rules: [
    ["shadow-std", { "box-shadow": "0 0 0.5rem rgba(0, 0, 0, 0.1)" }],
    ["align-self-center", { "align-self": "center" }],
    ["bg-arona-6", { "background-color": "#2773e1" }],
  ],
  shortcuts: {
    "card-float": "shadow-std rounded-lg gap-[24px] p-[24px]",
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      unit: "em",
    }),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        sans: "Inter",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
