export type Arrayable<T> = T | T[];
export type Awaitable<T> = Promise<T> | T;

export type HTMLElementCustomized<T> = HTMLElement & T;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * @deprecated stop to use null
 * @see {@link https://github.com/sindresorhus/meta/discussions/7}
 */
export type Nullable<T> = T | null;

export const mutable = <T extends readonly any[] | Record<string, unknown>>(
  val: T
) => val as Mutable<typeof val>;
