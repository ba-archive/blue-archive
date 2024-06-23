import { MockMethod } from "vite-plugin-mock";
export default [
  {
    url: "/v1/messages",
    method: "post",
    response: () => {
      return {
        role: "assistant",
        content: [
          {
            type: "text",
            text: '[{"word":"青空","yomi":"あおぞら","basic_form":"青空","word_type":"名詞・普通名詞","conjugation":"*"},{"word":"に","yomi":"に","basic_form":"に","word_type":"助詞・格助詞","conjugation":"*"},{"word":"、","yomi":"、","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"\\n","yomi":"\\n","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"たくさん","yomi":"たくさん","basic_form":"たくさん","word_type":"副詞","conjugation":"*"},{"word":"の","yomi":"の","basic_form":"の","word_type":"助詞・連体化","conjugation":"*"},{"word":"\\\"","yomi":"\\\"","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"気球","yomi":"きゅう","basic_form":"気球","word_type":"名詞・普通名詞","conjugation":"*"},{"word":"\\\"","yomi":"\\\"","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"が","yomi":"が","basic_form":"が","word_type":"助詞・格助詞","conjugation":"*"},{"word":"、","yomi":"、","basic_form":"*","word_type":"補助記号","conjugation":"*"},{"word":"浮かん","yomi":"うかん","basic_form":"浮かぶ","word_type":"動詞・自立","conjugation":"五段・バ行"},{"word":"で","yomi":"で","basic_form":"で","word_type":"助詞・格助詞","conjugation":"*"},{"word":"い","yomi":"い","basic_form":"いる","word_type":"動詞・非自立可能","conjugation":"母音動詞+基本形"},{"word":"た","yomi":"た","basic_form":"た","word_type":"助動詞","conjugation":"助動詞タ系+基本形"}]',
          },
        ],
      };
    },
  },
] as MockMethod[];
