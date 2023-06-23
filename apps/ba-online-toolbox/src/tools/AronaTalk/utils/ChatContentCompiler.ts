/* eslint-disable no-case-declarations */
import { ContentToken, MessageContentAst } from '../types/ChatContent';

function chatContentTokenizer(
  chatContent: string,
  escapeCharacter: string,
  commandDeclarator: string
) {
  let currentPos = 0;
  const tokens: ContentToken[] = [];

  while (currentPos < chatContent.length) {
    let currentChar = chatContent[currentPos];

    if ('\n' === currentChar) {
      tokens.push({
        type: 'LineBreak',
        value: '\n',
      });
      currentPos++;
      continue;
    }

    if (currentChar === escapeCharacter) {
      tokens.push({
        type: 'EscapeCharacter',
        value: currentChar,
      });
      currentPos++;
      continue;
    }

    if (currentChar === '{') {
      tokens.push({
        type: 'StickerDeclaratorOpen',
        value: currentChar,
      });
      currentPos++;
      continue;
    }

    if (currentChar === '}') {
      tokens.push({
        type: 'StickerDeclaratorClose',
        value: currentChar,
      });
      currentPos++;
      continue;
    }

    if (/\s/.test(currentChar)) {
      tokens.push({
        type: 'WhiteSpace',
        value: currentChar,
      });
      currentPos++;
      continue;
    }

    if (currentChar === commandDeclarator) {
      currentChar = chatContent[currentPos];
      tokens.push({
        type: 'CommandDeclarator',
        value: currentChar,
      });
      currentPos++;
      continue;
    }

    if (
      /[\uff20-\uff7e\uff00-\uffef\u3000-\u303f\ufe30-\ufe4f\u0021-\u002F\u003a-\u003f]/.test(
        currentChar
      )
    ) {
      tokens.push({
        type: 'Symbol',
        value: currentChar,
      });
      currentPos++;
      continue;
    }

    tokens.push({
      type: 'Text',
      value: currentChar,
    });
    currentPos++;
  }

  const reducedTokens: ContentToken[] = [];
  for (const token of tokens) {
    if (0 === reducedTokens.length) {
      reducedTokens.push(token);
      continue;
    }

    const lastToken = reducedTokens[reducedTokens.length - 1];
    if (
      ('Text' === lastToken.type && 'Text' === token.type) ||
      ('Symbol' === lastToken.type && 'Symbol' === token.type)
    ) {
      lastToken.value += token.value;
      continue;
    }

    reducedTokens.push(token);
  }

  return reducedTokens;
}

function chatContentParser(tokens: ContentToken[]) {
  const messageContentAst: MessageContentAst[] = [];

  let currentPos = 0;
  while (currentPos < tokens.length) {
    const currentToken = tokens[currentPos];
    switch (currentToken.type) {
      case 'EscapeCharacter':
        messageContentAst.push({
          type: 'Text',
          value: tokens[currentPos + 1].value,
        });
        currentPos += 2;
        break;
      case 'CommandDeclarator':
        messageContentAst.push({
          type: 'Command',
          value: tokens[currentPos + 1].value,
        });
        currentPos += 3; // 跳过命令与其他符号的分隔标签
        break;
      case 'StickerDeclaratorOpen':
        currentPos++;
        let stickerName = '';
        while (
          currentPos < tokens.length &&
          'StickerDeclaratorClose' !== tokens[currentPos].type
        ) {
          stickerName += tokens[currentPos].value;
          currentPos++;
        }
        messageContentAst.push({
          type: 'Sticker',
          value: stickerName,
        });
        currentPos++; // 跳过结束标签
        break;
      case 'StickerDeclaratorClose':
        // 意外的结束标签
        messageContentAst.push({
          type: 'Text',
          value: currentToken.value,
        });
        currentPos++;
        break;
      case 'WhiteSpace':
        messageContentAst.push({
          type: 'Text',
          value: ' ',
        });
        currentPos++;
        break;
      case 'LineBreak':
        messageContentAst.push({
          type: 'LineBreak',
          value: currentToken.value,
        });
        currentPos++;
        break;
      case 'Image':
        messageContentAst.push({
          type: 'Image',
          value: currentToken.value,
        });
        currentPos++;
        break;
      default:
        messageContentAst.push({
          type: 'Text',
          value: currentToken.value,
        });
        currentPos++;
        break;
    }
  }

  const reducedMessageContentAst: MessageContentAst[] = [];
  if (0 === messageContentAst.length) {
    return reducedMessageContentAst;
  }
  for (const ast of messageContentAst) {
    if (0 === reducedMessageContentAst.length) {
      reducedMessageContentAst.push(ast);
      continue;
    }

    const lastAst =
      reducedMessageContentAst[reducedMessageContentAst.length - 1];
    if (
      'Text' === lastAst.type &&
      ('Text' === ast.type || 'WhiteSpace' === ast.type)
    ) {
      lastAst.value += ast.value;
      continue;
    }

    reducedMessageContentAst.push(ast);
  }

  return reducedMessageContentAst;
}

function textToAst(
  chatContent: string,
  escapeCharacter = '\\',
  commandDeclarator = '/'
) {
  console.log(chatContent);
  const tokens = chatContentTokenizer(
    chatContent,
    escapeCharacter,
    commandDeclarator
  );
  return chatContentParser(tokens);
}

export { chatContentParser, chatContentTokenizer, textToAst };
