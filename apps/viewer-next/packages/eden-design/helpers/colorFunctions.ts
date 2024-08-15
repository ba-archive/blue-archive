import type { TextProps } from "../components/types/EdenTextCore/TextProps";

function getGradientDegree(degree: number | string | undefined) {
  switch (typeof degree) {
    case "number":
      return `${degree}deg`;
    case "string":
      return degree;
    default:
      return "0deg";
  }
}

export function parseColor(color: string) {
  return color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl")
    ? color
    : `var(${color.startsWith("--") ? color : `--${color}`})`;
}

export function getGradientStyle(color: {
  from: string;
  to: string;
  deg?: number | string;
}) {
  // @ts-ignore
  if ("[object Object]" !== Object.prototype.toString.call(color)) {
    return {};
  }

  return {
    backgroundImage: `linear-gradient(${getGradientDegree(color.deg)}, ${
      color.from
    }, ${color.to})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent !important",
  };
}
