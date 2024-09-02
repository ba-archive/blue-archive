export function parseSize(size: string | number) {
  if (typeof size === "number") {
    return size + "px";
  }

  return /^(\d+)(%|px|r?em|d?v[wh])$/.test(size + "") ? size : size + "px";
}
