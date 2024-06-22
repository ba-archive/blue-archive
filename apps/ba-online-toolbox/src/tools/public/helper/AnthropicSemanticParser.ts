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
  return text.replace(regexp, "");
}

const rag_request = {
  model: "",
  max_tokens: 1000,
  temperature: 0,
  system:
    /* eslint-disable-next-line max-len */
    "你是一名日语语言学专家。你需要解析用户给出的句子成分，并将句子成分以json格式返回。将原句中的'\n'解析为'未定義語'。",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "うちの庭には二羽鶏がいます",
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: '[{"word": "うち","furigana": "うち","basic_form": "うち","word_type": "名詞","word_sub_type": "普通名詞","conjungation_type": "*","conjungation_form": "*"},{"word": "の","furigana": "の","basic_form": "の","word_type": "助詞","word_sub_type": "接続助詞","conjungation_type": "*","conjungation_form": "*"},{"word": "庭","furigana": "にわ","basic_form": "庭","word_type": "名詞","word_sub_type": "普通名詞","conjungation_type": "*","conjungation_form": "*"},{"word": "に","furigana": "に","basic_form": "に","word_type": "助詞","word_sub_type": "格助詞","conjungation_type": "*","conjungation_form": "*"},{"word": "は","furigana": "は","basic_form": "は","word_type": "助詞","word_sub_type": "副助詞","conjungation_type": "*","conjungation_form": "*"},{"word": "二","furigana": "に","basic_form": "二","word_type": "名詞","word_sub_type": "数詞","conjungation_type": "*","conjungation_form": "*"},{"word": "羽","furigana": "わ","basic_form": "羽","word_type": "接尾辞","word_sub_type": "名詞性名詞助数辞","conjungation_type": "*","conjungation_form": "*"},{"word": "鶏","furigana": "にわとり","basic_form": "鶏","word_type": "名詞","word_sub_type": "普通名詞","conjungation_type": "*","conjungation_form": "*"},{"word": "が","furigana": "が","basic_form": "が","word_type": "助詞","word_sub_type": "格助詞","conjungation_type": "*","conjungation_form": "*"},{"word": "い","furigana": "い","basic_form": "いる","word_type": "動詞","word_sub_type": "非自立可能","conjungation_type": "母音動詞","conjungation_form": "基本形"},{"word": "ます","furigana": "ます","basic_form": "ます","word_type": "接尾辞","word_sub_type": "動詞性接尾辞","conjungation_type": "動詞性接尾辞ます型","conjungation_form": "基本形"}]',
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "\\n",
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: '[{"word": "\\n","furigana": "\\n","basic_form": "\\n","word_type": "未定義語","word_sub_type": "その他","conjungation_type": "*","conjungation_form": "*"}]',
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "青空に\nたくさんの気球が\n浮かんでいた",
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

  if (input && input.length < 10) {
    result.status = AnthropicStatusCode.TOO_SHORT;
    result.message = "输入过短，请在长度超过10个字符的文本中使用。";
  }

  if (!ANTHROPIC_TIER1_SECRET || ANTHROPIC_TIER1_SECRET.length === 0) {
    result.status = AnthropicStatusCode.NO_API_KEY;
    result.message = "找不到 Anthropic API Key";
  }

  rag_request.messages[4].content[0].text = distillText(input);
  await instance
    .post("/v1/messages", rag_request)
    .then(res => {
      const data = res.data as ClaudeMessage;
      const response = data.content[0].text;
      if (!response) {
        result.status = AnthropicStatusCode.JSON_PARSE_ERROR;
        result.message = "解析模型返回失败，请告诉开发帕鲁哪一句出了问题";
        return result;
      }
      result.tokens = JSON.parse(response) as SemanticUnit[];
    })
    .catch((e: AxiosError) => {
      result.status = AnthropicStatusCode.API_ERROR;
      result.message = "未知错误：" + e.message;
      return result;
    });

  return result;
}

export type { ClaudeMessage, ClaudeRoleplayContent };

export { parseSemantics };
