import { get } from "lodash-es";
import { computed, inject, isRef, ref, unref } from "vue";
import type { InjectionKey, Ref } from "vue";
import ZhCn from "./locale/lang/zh-cn";
import type { MaybeRef } from "@vueuse/core";
import type { Language } from "./locale";

export type LocaleContext = {
  locale: Ref<Language>;
  lang: Ref<string>;
  t: Translator;
};
export type Translator = (path: string, option?: TranslatorOption) => string;
export type TranslatorOption = Record<string, string | number>;

export const buildLocaleContext = (
  locale: MaybeRef<Language>
): LocaleContext => {
  const lang = computed(() => unref(locale).name);
  const localeRef = isRef(locale) ? locale : ref(locale);
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale),
  };
};

export const buildTranslator =
  (locale: MaybeRef<Language>): Translator =>
  (path, option) =>
    translate(path, option, unref(locale));

export const localeContextKey: InjectionKey<Ref<Language | undefined>> =
  Symbol("localeContextKey");

export const translate = (
  path: string,
  option: undefined | TranslatorOption,
  locale: Language
): string =>
  (get(locale, path, path) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  );

export const useLocale = (localeOverrides?: Ref<Language | undefined>) => {
  const locale = localeOverrides || inject(localeContextKey, ref())!;
  return buildLocaleContext(computed(() => locale.value || ZhCn));
};
