import axios from "axios";
import secrets from "../secrets.json";

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
  // baseURL: "https://api.anthropic.com/v1",
  headers: {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
    "x-api-key": ANTHROPIC_TIER1_SECRET || "",
  },
});

const rag_request = {
  model: "",
  max_tokens: 1000,
  temperature: 0,
  system:
    /* eslint-disable-next-line max-len */
    '你是一名以中国大陆普通话为母语的日译中专家,你的任务是将用户给出的架空世界游戏中的日语脚本翻译成流畅的、符合简体中文语言习惯的中文.在翻译中,你可能会遇到部分你不了解的地名和人名.当遇到相关人名时,请使用"_原文_"的方式标记出来.关于地名和组织名称译文,请参考以下文档.如果文档中没有,你可以参考文档中与原文重合的相关部分,并且直接使用原文中的汉字（注意和制汉字应当转换）来决定译名.\n<document>\nシャーレ:夏莱\nワイルドハント:狂猎\n帰宅部:回家部\nアビドス:阿比多斯\nアリウススクワッド:阿里乌斯小队\n救急医学部:急救医学部\nエンジニア部:工程部\n給食部:供餐部\nゲヘナ:格黑娜\n放課後スイーツ部:放学后甜点部\nミレニアムサイエンススクール:千年科技学院\nパンデモニウム・ソサエティー:万魔殿\nレッドウィンター:红冬\n補習授業部:补习部\nシスターフッド:修女会\nティーパーティー:茶会\nセミナー:研讨会\nトリニティ:圣三一\nヴァルキューレ:瓦尔基里\nヴェリタス:真理部\n</document>\n一部分专有名词的文档如下：\n<document>\nモモトーク:MomoTalk\n</document>\n为了行文流畅,你可以尝试：\n-让翻译符合口语习惯\n-合并一部分主语相同的句子\n-一部分后置的名词提到最前\n-避免过长的定语\n-有节制地使用一些形容和比喻等手法让句子更加流畅,但注意不要让句子偏离原意.\n-通过"……后"、"……之后"等衔接词,表现出动作的先后顺序\n-不要将“在那里”之类的地点指示状语单独成句\n-在必要的时候,可以调整语序,使翻译过后的语句更加接近“主+谓+宾”的形式.\n-如果你觉得有必要,可以补充主语.\n在原文中,你可能会遇到一些被方括号[]、或是以方括号标记的成对开闭标签[tag=example][/tag]等包裹起来的内容.不要删除这些方括号,并尽量翻译,保持翻译前后方括号内的名词等意思一致.你可以删除[log=xxx][/log]这个标签,但是不要删除标签内的内容.此外,在遇到"\\n"时,保留这个特殊换行符.在这个会话中,用户仅会给出日语文本,请将用户给出的每一句话(包括疑问句)都视为需要翻译的内容.你只需要把给出的日语文本翻译成中文,不需要做出额外回答.最后,将输出中的英文半角标点改成全角标点.',
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: '[s1] \\"少し散歩しようかなって。\\"\\n[s2] \\"ユウカは？\\"',
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "[s1] “我正想稍微散散步来着。”\\n[s2] “_ユウカ_呢？”",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "ウミカの連絡を受け百夜堂を訪れた先生。そこではウミカがやんちゃなお客さんたちに困惑していた。そこで先生のアドバイスを受けたウミカは真心を込めた「おもてなし」をすべく、行動に出るのであった。",
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "接到_ウミカ_的联络后，老师来到百夜堂，看到_ウミカ_正为一群顽皮的客人感到困扰。听了老师的建议后，_ウミカ_决定付诸行动，用真诚的心意来“招待”客人。",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "[wa:1800]― まさか[wa:500]たった[wa:300]数か月の[wa:600]間に[wa:1100]ここまで[wa:500]体力が[wa:500]落ちていた[wa:200]なんて……",
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "[wa:1800]― 没想到[wa:500]只过了[wa:300]几个月[wa:600]时间[wa:1100]体力[wa:500]就下降[wa:500]到了[wa:200]这种程度……",
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "text", text: "" }],
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

function getClaudeTranslation(
  input: string,
  model: 0 | 1 | 2 | "haiku" | "sonnet" | "opus" = 0,
  temperature = 0
) {
  rag_request.model = (
    models.find(el => el.alias.includes(model)) || models[0]
  ).modelName;
  rag_request.temperature = temperature;
  if (temperature >= 0.33) {
    rag_request.system += "可以改写大量原句结构以追求通顺和符合原文语气.";
  } else if (temperature >= 0.66) {
    rag_request.system += "可以改变些许原句结构以追求通顺和符合原文语气.";
  } else {
    rag_request.system += "在通顺的基础上尽最大可能保持原句结构.";
  }

  const error_message = { content: [{ type: "text", text: "" }] };

  if (input && input.length < 10) {
    error_message.content[0].text =
      "输入过短，请在长度超过10个字符的文本中使用。";
    return new Promise(resolve => resolve(error_message));
  }

  if (!ANTHROPIC_TIER1_SECRET || ANTHROPIC_TIER1_SECRET.length === 0) {
    error_message.content[0].text = "找不到 Anthropic API Key";
    return new Promise(resolve => resolve(error_message));
  }

  rag_request.messages[6].content[0].text = input;

  return instance
    .post("/v1/messages", rag_request)
    .then(res => res.data)
    .catch(e => {
      error_message.content[0].text = e.message;
      return error_message;
    });
}

export type { ClaudeMessage, ClaudeRoleplayContent };

export { getClaudeTranslation };
