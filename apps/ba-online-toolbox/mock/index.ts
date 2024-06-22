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
            text: '[{"word":"青空","furigana":"あおぞら","basic_form":"青空","word_type":"名詞","word_sub_type":"普通名詞","conjungation_type":"*","conjungation_form":"*"},{"word":"に","furigana":"に","basic_form":"に","word_type":"助詞","word_sub_type":"格助詞","conjungation_type":"*","conjungation_form":"*"},{"word":"\\n","furigana":"","basic_form":"","word_type":"未定義語","word_sub_type":"その他","conjungation_type":"*","conjungation_form":"*"},{"word":"たくさん","furigana":"たくさん","basic_form":"たくさん","word_type":"副詞","word_sub_type":"一般","conjungation_type":"*","conjungation_form":"*"},{"word":"の","furigana":"の","basic_form":"の","word_type":"助詞","word_sub_type":"連体化","conjungation_type":"*","conjungation_form":"*"},{"word":"気球","furigana":"ききゅう","basic_form":"気球","word_type":"名詞","word_sub_type":"普通名詞","conjungation_type":"*","conjungation_form":"*"},{"word":"が","furigana":"が","basic_form":"が","word_type":"助詞","word_sub_type":"格助詞","conjungation_type":"*","conjungation_form":"*"},{"word":"\\n","furigana":"","basic_form":"","word_type":"未定義語","word_sub_type":"その他","conjungation_type":"*","conjungation_form":"*"},{"word":"浮か","furigana":"うか","basic_form":"浮く","word_type":"動詞","word_sub_type":"一般","conjungation_type":"五段・カ行イ音便","conjungation_form":"連用形"},{"word":"んで","furigana":"んで","basic_form":"ぬ","word_type":"助動詞","word_sub_type":"*","conjungation_type":"助動詞-ぬ","conjungation_form":"連用形"},{"word":"い","furigana":"い","basic_form":"いる","word_type":"動詞","word_sub_type":"非自立可能","conjungation_type":"上一段-ア行","conjungation_form":"連用形"},{"word":"た","furigana":"た","basic_form":"た","word_type":"助動詞","word_sub_type":"*","conjungation_type":"助動詞-タ","conjungation_form":"基本形"}]',
          },
        ],
      };
    },
  },
] as MockMethod[];
