import { defineStore } from "pinia";
import { Scenario } from "../../ScenarioEditor/types/content";
import { isEmpty } from "radashi";

export const useDiffComparatorStore = defineStore({
  id: "diffComparatorStore",
  state: () => {
    return {
      files: [
        { name: "file1", content: {} as Scenario },
        { name: "file2", content: {} as Scenario },
      ],
    };
  },
  // @ts-ignore
  persist: true,
  getters: {
    getFileAll: state => state.files,
    getFile: state => (position: number) => state.files[position],
    isFullyLoaded: state => state.files.every(file => !isEmpty(file.content)),
  },
  actions: {
    setFile(position: number, name: string, content: Scenario) {
      this.files[position] = { name, content };
    },
    swapFiles() {
      const temp = this.files[0];
      this.files[0] = this.files[1];
      this.files[1] = temp;
    }
  },
});
