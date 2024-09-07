export function parseSize(size: string | number | undefined) {
  if (!size) return null;

  if (typeof size === "number") {
    return size + "px";
  }

  return /^(\d+)(%|px|r?em|d?v[wh])$/.test(size + "") ? size : size + "px";
}
