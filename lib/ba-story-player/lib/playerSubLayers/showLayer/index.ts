import { ref } from "vue";
import { Layer, Language } from "../../type";

export class ShowLayer extends Layer {
  language = ref("cn" as Language);
}
