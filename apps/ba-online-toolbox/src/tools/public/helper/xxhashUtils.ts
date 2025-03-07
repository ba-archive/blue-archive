import xxhash from "xxhashjs";

export function toHash(text: string | undefined) {
  if (!text) return undefined;
  return xxhash.h32(text, 0).toNumber();
}
