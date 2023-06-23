export type Config2Map<Config> = {
  [key in keyof Config]: {
    value: Config[key];
    description: string;
  };
};

export type Config2Form<Config> = {
  [key in keyof Config]: Config[key] | null;
};

export function enumTypeList<T extends object>(list: T) {
  return Object.keys(list).map((key) => ({
    label: Reflect.get(list, key),
    value: key,
  }));
}
