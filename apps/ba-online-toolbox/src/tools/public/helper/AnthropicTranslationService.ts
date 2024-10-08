import secrets from "../secrets.json";
import type { AxiosError } from "axios";
import { createAnthropicInstance } from "./AnthropicUtils";

const { ANTHROPIC_TIER1_SECRET } = secrets;

interface ClaudeContent {
  type: "text" | "error";
  text?: string;
  error_code?: number;
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

enum TranslationMode {
  "new",
  "amend",
}

const instance = createAnthropicInstance();

const sft_request = {
  model: "",
  max_tokens: 1000,
  temperature: 0,
  system:
    /* eslint-disable-next-line max-len */
    [
      {
        type: "text",
        text: '你是一名以中国大陆普通话为母语的日译中专家，你的任务是将用户给出的架空世界游戏中的日语脚本翻译成流畅且符合简体中文语言习惯的中文。在翻译中，你可能会遇到部分你不了解的地名和人名。遇到相关人名时，使用"_原文_"的方式标记。关于地名和组织名称译文，请参考以下文档。如果文档中没有，你可以参考文档中与原文重合的相关部分，并且直接使用原文中的汉字（注意和制汉字应当转换）来决定译名。把中文全部看作用户提出的修改意见，日语全部看作需要翻译的内容。用户不会通过日语向你提问。\n<document>\nキヴォトス: 基沃托斯\nシャーレ: 夏莱\nワイルドハント: 狂猎\n帰宅部: 回家部\nアビドス: 阿比多斯\nアリウススクワッド: 阿里乌斯小队\n救急医学部: 急救医学部\nエンジニア部: 工程部\n給食部: 供餐部\nゲヘナ: 格黑娜\n放課後スイーツ部: 放学后甜点部\nミレニアムサイエンススクール: 千年科技学院\nパンデモニウム・ソサエティー: 万魔殿\nレッドウィンター: 红冬\n補習授業部: 补习部\nシスターフッド: 修女会\nティーパーティー: 茶会\nセミナー: 研讨会\nトリニティ: 圣三一\nヴァルキューレ: 瓦尔基里\nヴェリタス: 真理部\nキラキラ部: 亮闪闪部\nアビドス生徒会: 阿比多斯学生会\nハイランダー鉄道学園: 海兰德铁道学园\nゲマトリア: 数秘术\n</document>\n一部分专有名词的文档如下：\n<document>\nモモトーク:MomoTalk\n</document>\n为了行文流畅，你可以尝试：\n- 合并一部分主语相同的句子\n- 一部分后置的名词提到最前\n- 避免过长的定语\n- 有节制地使用一些形容和比喻等手法让句子更加流畅，但是注意不要让句子偏离原意。\n- 通过"……后"、"……之后"等衔接词，表现出动作的先后顺序\n- 不要将“在那里”之类的地点指示状语单独成句\n- 在必要的时候，可以调整语序，使翻译过后的语句更加接近“主语+谓语+宾语”的形式。\n- 如果你觉得有必要，可以补充主语。\n在原文中，你可能会遇到一些被方括号[]、或是以方括号标记的成对开闭标签[tag=example][/tag]等包裹起来的内容。这些标签是控制字符，不要删除这些方括号，并尽量翻译，保持翻译前后方括号内的名词等意思一致。你可以删除[log=xxx][/log]这个标签，但是不要删除标签内的内容。另外，也请尽量保持原文中的换行关系。此外，在遇到"\\n"时，保留这个特殊换行符。在这个会话中，用户仅会给出日语文本，你只需要把给出的日语文本翻译成中文，不需要做出额外回答。将用户给出的每一句话(包括疑问句)都视为需要翻译的内容。最后，将输出中的英文半角逗号和句号改成全角。\n遇到含有[wa:number]的句型时，在语句通顺的前提下尽可能保持两个[wa:number]之间的字数与原文是基本相同的。\n以下是例子，用户输入为input，输出内容为output。comment是例子中提醒你应当注意的地方。\n\n<examples>\n<input>\n[s1] \\"少し散歩しようかなって。\\"\\n[s2] \\"ユウカは？\\"\n</input>\n<output>\n[s1] “我正想稍微散散步来着。”\\n[s2] “_ユウカ_呢？”\n</output>\n<comment>\n注意不要遗漏两个选项标签[s+数字]、[ns]中间的换行符\\n\n</comment>\n\n<input>\nウミカの連絡を受け百夜堂を訪れた先生。そこではウミカがやんちゃなお客さんたちに困惑していた。#nそこで先生のアドバイスを受けたウミカは真心を込めた「おもてなし」をすべく、行動に出るのであった。\n</input>\n<output>\n收到_ウミカ_的消息后，老师来到百夜堂，看到_ウミカ_正为一群顽皮的客人感到困扰。\\n听了老师的建议后，_ウミカ_决定付诸行动，用真诚的心意来“招待”客人。\n</output>\n<comment>\n为了达到“删除冗余成分，使句子连贯、逻辑通顺”的目的，你可以调整翻译后的语序\n</comment>\n\n<input>\n[wa:1800]― まさか[wa:500]たった[wa:300]数か月の[wa:600]間に[wa:1100]ここまで[wa:500]体力が[wa:500]落ちていた[wa:200]なんて……。\n</input>\n<output>\n[wa:1800]― 没想到[wa:500]只过了[wa:300]几个月[wa:600]时间[wa:1100]体力[wa:500]就下降[wa:500]到了[wa:200]这种程度……\n</output>\n<comment>\n原样保留标签[wa:number]。尽量保持两个[wa]标签之间的字数与原文基本相同；省略号“……”后面不需要句号“。”\n</comment>\n\n<input>\n収支報告書からお願い！\n</input>\n<output>\n那就先从收支报告表开始吧！\n</output>\n<comment>\n把所有的日语句子看作需要翻译的内容\n</comment>\n\n<input>\nヘルメット団が学校の掲示板を盗もうとしてたでしょ？\n</input>\n<output>\n当时那群钢盔团不是想要偷走学校的布告栏吗？\n</output>\n<comment>\n把所有的日语句子看作需要翻译的内容\n</comment>\n\n<input>\n「15時10分11秒。[USERNAME]先生が業務中に伸びをし、3秒間あくびをした」\n</input>\n<output>\n“15点10分11秒。[USERNAME]老师在工作中伸了个懒腰，并打了三秒的哈欠”\n</output>\n<comment>\n保留特殊标签[USERNAME]\n</comment>\n\n接下来，用户将会通过对话给你需要翻译的日语台本。把中文全部看作用户提出的修改意见，日语全部看作需要翻译的内容。用户不会通过日语向你提问。如果原文没有引号，译文也不需要引号。',
        cache_control: { type: "ephemeral" },
      },
    ],
  messages: [
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
  temperature = 0,
  mode = TranslationMode.new,
  currentText = "",
  currentTranslation = "",
  advice = ""
) {
  sft_request.model = (
    models.find(el => el.alias.includes(model)) || models[0]
  ).modelName;
  sft_request.temperature = temperature;

  const error_message = {
    content: [{ type: "error", text: "", error_code: 0 }],
  };

  if (input && input.length < 10) {
    error_message.content[0].text =
      "输入过短，请在长度超过10个字符的文本中使用。";
    return new Promise(resolve => resolve(error_message));
  }

  if (!ANTHROPIC_TIER1_SECRET || ANTHROPIC_TIER1_SECRET.length === 0) {
    error_message.content[0].text = "找不到 Anthropic API Key";
    return new Promise(resolve => resolve(error_message));
  }

  // reset sft_request
  sft_request.messages = [
    {
      role: "user",
      content: [{ type: "text", text: "" }],
    },
  ];

  sft_request.messages[0].content[0].text =
    "翻译下面这句话，除非用户用中文向你提问，否则不要输出任何其他内容：" +
    input;

  if (mode === TranslationMode.amend) {
    sft_request.messages.push({
      role: "assistant",
      content: [
        {
          type: "text",
          text: currentTranslation,
        },
      ],
    });
    sft_request.messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: "修改上一句翻译：" + advice,
        },
      ],
    });
  }

  return instance
    .post("/v1/messages", sft_request)
    .then(res => res.data)
    .catch((e: AxiosError) => {
      error_message.content[0].text = e.message;
      error_message.content[0].error_code = e.response?.status ?? 500;
      return error_message;
    });
}

export type { ClaudeMessage, ClaudeRoleplayContent };

export { getClaudeTranslation };
