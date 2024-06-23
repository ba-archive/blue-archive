import axios, { AxiosError } from "axios";
import secrets from "../secrets.json";
import {
  AnthropicStatusCode,
  SemanticUnit,
} from "../../ScenarioEditor/types/Semantic";

const { ANTHROPIC_TIER1_SECRET } = secrets;

interface ClaudeContent {
  type: "text";
  text?: string;
}

interface ClaudeMessage {
  id: string;
  type: "message";
  role: "user" | "assistant";
  content: ClaudeContent[];
  model: string;
  stop_reason: string;
  stop_sequence: null | number | string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ClaudeRoleplayContent {
  role: "user" | "assistant";
  content: ClaudeContent[];
}

// anthropic API 有问题，自己构建一个 axios 实例
const instance = axios.create({
  // baseURL: "https://api.anthropic.com",
  headers: {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
    "x-api-key": ANTHROPIC_TIER1_SECRET || "",
  },
});

function distillText(text: string) {
  // replace all square brackets and contents inside, "\\"" with ""
  const regexp = /\[.*?\]|\\"|\s/g;
  return text.replaceAll(regexp, "").replaceAll("#n", "\n");
}

const rag_request = {
  model: "",
  max_tokens: 4096,
  temperature: 0,
  system:
    /* eslint-disable-next-line max-len */
    "你是一名日语语言学专家。你需要解析用户给出的句子语素，并将语素以JSON格式返回。单独解析换行符元素'\\n'，并转义原文中的引号。",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: 'うちの庭には\n二羽"鶏"がいます',
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: '[{"word":"うち","yomi":"うち","basic_form":"うち","word_type":"名詞・普通名詞","conjugation":"*"},{"word":"の","yomi":"の","basic_form":"の","word_type":"助詞・接続助詞","conjugation":"*"},{"word":"庭","yomi":"にわ","basic_form":"庭","word_type":"名詞・普通名詞","conjugation":"*"},{"word":"に","yomi":"に","basic_form":"に","word_type":"助詞・格助詞","conjugation":"*"},{"word":"は","yomi":"は","basic_form":"は","word_type":"助詞・副助詞","conjugation":"*"},{"word":"\\\\n","yomi":"\\\\n","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"二","yomi":"に","basic_form":"二","word_type":"名詞・数詞","conjugation":"*"},{"word":"羽","yomi":"わ","basic_form":"羽","word_type":"接尾辞・名詞性名詞助数辞","conjugation":"*"},,{"word":"\\"","yomi":"\\"","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"鶏","yomi":"にわとり","basic_form":"鶏","word_type":"名詞・普通名詞","conjugation":"*"},,{"word":"\\"","yomi":"\\"","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"が","yomi":"が","basic_form":"が","word_type":"助詞・格助詞","conjugation":"*"},{"word":"い","yomi":"い","basic_form":"いる","word_type":"動詞・非自立可能","conjugation":"母音動詞+基本形"},{"word":"ます","yomi":"ます","basic_form":"ます","word_type":"接尾辞・動詞性接尾辞","conjugation":"動詞性接尾辞ます型+基本形"}]',
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "青空に、\nたくさんの気球が、\n浮かんでいた。",
        },
      ],
    },
  ],
};

const models = [
  {
    modelName: "claude-3-haiku-20240307",
    alias: [0, "haiku"],
  },
  {
    modelName: "claude-3-5-sonnet-20240620",
    alias: [1, "sonnet"],
  },
  {
    modelName: "claude-3-opus-20240229",
    alias: [2, "opus"],
  },
];

async function parseSemantics(
  input: string,
  model: 0 | 1 | 2 | "haiku" | "sonnet" | "opus" = 1
) {
  rag_request.model = (
    models.find(el => el.alias.includes(model)) || models[0]
  ).modelName;

  const result = {
    status: AnthropicStatusCode.NORMAL,
    message: "",
    tokens: [] as SemanticUnit[],
  };

  const CJKChars = new RegExp(
    "[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]"
  );

  if (!CJKChars.test(input)) {
    result.status = AnthropicStatusCode.NO_CJK;
    result.message =
      "输入不包含有效日文字符";
  }

  if (input && input.length < 10) {
    result.status = AnthropicStatusCode.TOO_SHORT;
    result.message = "输入过短，请在长度超过10个字符的文本中使用。";
  }

  if (!ANTHROPIC_TIER1_SECRET || ANTHROPIC_TIER1_SECRET.length === 0) {
    result.status = AnthropicStatusCode.NO_API_KEY;
    result.message = "找不到 Anthropic API Key";
  }

  rag_request.messages[2].content[0].text = distillText(input);
  await instance
    .post("/v1/messages", rag_request)
    .then(res => {
      const data = res.data as ClaudeMessage;
      const response = data.content[0].text;
      if (!response) {
        result.status = AnthropicStatusCode.OTHER;
        result.message = "模型未返回结果，请告诉开发帕鲁哪一句出了问题";
        return result;
      }
      result.tokens = JSON.parse(response) as SemanticUnit[];
    })
    .catch((e: AxiosError) => {
      if (e.message.includes("property value in JSON at position")) {
        result.status = AnthropicStatusCode.JSON_PARSE_ERROR;
        result.message = "解析模型返回失败，请告诉开发帕鲁哪一句出了问题";
      } else {
        result.status = AnthropicStatusCode.API_ERROR;
        result.message = "未知错误：" + e.message;
      }
      return result;
    });

  return result;
}

export type { ClaudeMessage, ClaudeRoleplayContent };

export { parseSemantics };
