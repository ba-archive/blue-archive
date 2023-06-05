import { Language } from '../types/Settings';
import { localeString } from './localeString';

const fallbackLocale: Language = 'en';

function getDeepI18nString(userLanguage: Language, key: string): string {
  const keys = key.split('.');
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  let result: any = {};

  keys.forEach((key, index) => {
    if (0 === index) {
      result = Reflect.get(localeString, userLanguage);
    }
    result = 'object' === typeof result ? Reflect.get(result, key) : undefined;
  });

  return 'string' === typeof result ? result : key;
}

function getI18nString(
  userLanguage: Language = 'cn',
  key: string,
  params: { [key: string]: string } = {}
) {
  let translatedString = key.includes('.')
    ? getDeepI18nString(userLanguage, key)
    : Reflect.get(Reflect.get(localeString, userLanguage), key) ||
      Reflect.get(Reflect.get(localeString, fallbackLocale), key) ||
      key;

  if (0 !== Object.keys(params).length) {
    for (const [key, value] of Object.entries(params)) {
      translatedString = translatedString?.replaceAll(`{${key}}`, value);
    }
  }

  return translatedString;
}

export { getI18nString };
