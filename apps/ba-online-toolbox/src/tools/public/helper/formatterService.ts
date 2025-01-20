import { formalizePunctuation } from "./formatters/punctuationFormatter";
import { replaceStrings } from "./config/replaceStrings";

export function formalizeStrings(content: string) {
  let contentString = formalizePunctuation(content);
  replaceStrings.forEach((item) => {
    contentString = contentString.replaceAll(item.from, item.to);
  });
  return contentString;
}