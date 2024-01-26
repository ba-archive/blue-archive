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
    function getOptions(propertyChain: string[]) {
      let current: UnitTestsFilteByCategory = cloneDeep(
        props.unitTestsFilteByCategory
      );
      for (const property of propertyChain) {
        console.log("property: ", property);
        if (Reflect.get(current[property], "getStoryNodes") !== undefined) {
          return;
        }
        current = current[property] as UnitTestsFilteByCategory;
      }
      console.log("current:", current);
      return Object.keys(current).map(option => h("option", option));
    }
    function getFinalSelects(propertyChain: string[]) {
      console.log("getFinalSelects run! propertyChain:", propertyChain);
      const currentFinalSelects: VNode[] = [];
      for (
        let currentLen = 0;
        currentLen < propertyChain.length + 1;
        ++currentLen
      ) {
        const options = getOptions(propertyChain.slice(0, currentLen));
        if (options) {
          currentFinalSelects.push(
            h(
              "select",
              {
                style: {
                  display: "block",
                  margin: "3px 0",
                },
                onChange: (e: Event) => {
                  const select = e.target as HTMLSelectElement;
                  const persistLen = Number(currentLen);
                  const currentModelValue = propertyChain
                    .slice(0, persistLen)
                    .concat([select.value]);
                  emit("update:modelValue", currentModelValue);
                  finalSelects.value = getFinalSelects(currentModelValue);
                  console.log("finalSelects:", finalSelects.value);
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
