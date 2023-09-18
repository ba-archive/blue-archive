export interface ContentToken {
  type: 'Text' | 'QuotationMark' | 'SingleQuotationMark';
  value: string;
}
function contentTokenizer(content: string) {
  const contentToken: ContentToken[] = [];
  let currentPos = 0;
  let quotationMarkCount = 0;
  let singleQuotationMarkCount = 0;
  while (currentPos < content.length) {
    const currentChar = content[currentPos];
    if (['"', '＂', '“', '”'].includes(currentChar)) {
      quotationMarkCount++;
      contentToken.push({
        type: 'QuotationMark',
        value: quotationMarkCount % 2 === 0 ? 'Close' : 'Open',
      });
      currentPos++;
      continue;
    }

    if (["'", '＇', '‘', '’'].includes(currentChar)) {
      singleQuotationMarkCount++;
      contentToken.push({
        type: 'SingleQuotationMark',
        value: singleQuotationMarkCount % 2 === 0 ? 'Close' : 'Open',
      });
      currentPos++;
      continue;
    }

    contentToken.push({
      type: 'Text',
      value: currentChar,
    });
    currentPos++;
  }
  return contentToken;
}

function quotationFormalizer(content: ContentToken[]) {
  let contentString = '';
  for (const token of content) {
    if (token.type === 'QuotationMark') {
      contentString += token.value === 'Open' ? '“' : '”';
    } else if (token.type === 'SingleQuotationMark') {
      contentString += token.value === 'Open' ? '‘' : '’';
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
