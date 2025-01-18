import { formalizePunctuation } from "./formatters/punctuationFormatter";
import { replaceStrings } from "./config/replaceStrings";

export function formalizeStrings(content: string) {
  let contentString = formalizePunctuation(content);
  replaceStrings.forEach((item) => {
    contentString = contentString.replace(item.from, item.to);
  });
  return contentString;
}