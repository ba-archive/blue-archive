export type SemanticUnit = {
  word: string;
  furigana: string;
  basic_form: string;
  word_type: string;
  word_sub_type: string;
  conjungation_type: string;
  conjungation_form: string;
};

export enum AnthropicStatusCode {
  NORMAL,
  TOO_SHORT,
  NO_API_KEY,
  API_ERROR,
  JSON_PARSE_ERROR,
  OTHER,
}

export type SemanticParseResult = {
  status: AnthropicStatusCode;
  message: string;
  tokens: SemanticUnit[];
}