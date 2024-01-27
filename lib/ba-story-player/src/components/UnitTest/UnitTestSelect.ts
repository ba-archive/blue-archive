import { h, defineComponent, PropType, VNode, ref } from "vue";
import { UnitTestsFilteByCategory } from "./unitTests";
import { cloneDeep } from "lodash-es";

export default defineComponent({
  props: {
    unitTestsFilteByCategory: {
      type: Object as PropType<UnitTestsFilteByCategory>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Array<string>>,
      required: true,
    },
  },
  setup(props, { emit }) {
    function getOptions(propertyChain: string[], currentSelectOption?: string) {
      let current: UnitTestsFilteByCategory = cloneDeep(
        props.unitTestsFilteByCategory
      );
      for (const property of propertyChain) {
        if (Reflect.get(current[property], "getStoryNodes") !== undefined) {
          return;
        }
        current = current[property] as UnitTestsFilteByCategory;
      }
      const options = Object.keys(current);
      if (currentSelectOption) {
        return options.map(option => {
          if (option === currentSelectOption) {
            return h("option", { selected: true }, [option]);
          } else {
            return h("option", option);
          }
        });
      } else {
        const finalOptionNodes = options.map(option => h("option", option));
        finalOptionNodes.unshift(
          h("option", { disable: true, selected: true, hidden: true }, [""])
        );
        return finalOptionNodes;
      }
    }
    function getFinalSelects(propertyChain: string[]) {
      const currentFinalSelects: VNode[] = [];
      for (
        let currentLen = 0;
        currentLen < propertyChain.length + 1;
        ++currentLen
      ) {
        let options: VNode[] | undefined;
        if (currentLen < propertyChain.length) {
          options = getOptions(
            propertyChain.slice(0, currentLen),
            propertyChain[currentLen]
          );
        } else {
          options = getOptions(propertyChain.slice(0, currentLen));
        }

        if (options) {
          currentFinalSelects.push(
            h(
              "select",
              {
                style: {
                  display: "block",
                  margin: "3px 0",
                },
                onInput: (e: Event) => {
                  const select = e.target as HTMLSelectElement;
                  const persistLen = Number(currentLen);
                  const currentModelValue = propertyChain
                    .slice(0, persistLen)
                    .concat([select.value]);
                  emit("update:modelValue", currentModelValue);
                  finalSelects.value = getFinalSelects(currentModelValue);
                },
              },
              options
            )
          );
        } else {
          break;
        }
      }

      return currentFinalSelects;
    }

    const finalSelects = ref<VNode[]>([]);
    finalSelects.value = getFinalSelects(props.modelValue);

    return () => h("div", null, finalSelects.value);
  },
});
