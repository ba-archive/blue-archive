export function parseSize(size: string | number | undefined) {
  if (!size) return null;

  if (typeof size === "number") {
    return size + "px";
  }

  return /^(\d+\.?\d*)$/.test(size + "") ? size + "px" : size;
}
