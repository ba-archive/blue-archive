export function parseSize(size: string | number) {
  if (typeof size === "number") {
    return size + "px";
  }

  return /^(\d+)(px|rem|em|d?vw|d?vh)$/.test(size + "") ? size : size + "px";
}
