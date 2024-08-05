export interface ContentToken {
  type: "Comma" | "Text" | "QuotationMark" | "SingleQuotationMark";
  value: string;
}
function contentTokenizer(content: string) {
  const contentToken: ContentToken[] = [];
  let currentPos = 0;
  let quotationMarkCount = 0;
  let singleQuotationMarkCount = 0;
  while (currentPos < content.length) {
    const currentChar = content[currentPos];
    if (['"', "＂", "“", "”", "「", "」"].includes(currentChar)) {
      quotationMarkCount++;
      contentToken.push({
        type: "QuotationMark",
        value: quotationMarkCount % 2 === 0 ? "Close" : "Open",
      });
      currentPos++;
      continue;
    }

    if (["'", "＇", "‘", "’", "『", "』"].includes(currentChar)) {
      singleQuotationMarkCount++;
      contentToken.push({
        type: "SingleQuotationMark",
        value: singleQuotationMarkCount % 2 === 0 ? "Close" : "Open",
      });
      currentPos++;
      continue;
    }

    if ("，" === currentChar) {
      contentToken.push({
        type: "Comma",
        value: ",",
      });
      currentPos++;
      continue;
    }

    contentToken.push({
      type: "Text",
      value: currentChar,
    });
    currentPos++;
  }
  return contentToken;
}

function quotationFormalizer(content: ContentToken[]) {
  let contentString = "";
  const length = content.length;
  for (let i = 0; i < length; i++) {
    const token = content[i];
    if (token.type === "QuotationMark") {
      contentString += token.value === "Open" ? "“" : "”";
    } else if (token.type === "SingleQuotationMark") {
      contentString += token.value === "Open" ? "‘" : "’";
    } else if (token.type === "Comma") {
      // 如果逗号前后两个字相同，逗号改为顿号
      if (i >= 1 && i < length - 1) {
        const preToken = content[i - 1];
        const nextToken = content[i + 1];
        if (preToken.value === nextToken.value) {
          contentString += "、";
          continue;
        } else {
          contentString += "，";
        }
      } else {
        contentString += "，";
      }
    } else {
      contentString += token.value;
    }
  }
  return contentString;
}

function formalizeQuotation(content: string) {
  const contentToken = contentTokenizer(content);
  return quotationFormalizer(contentToken);
}

export { formalizeQuotation };
