import { defineStore } from "pinia";
import { SemanticUnit } from "../types/Semantic";
import xxhash from "xxhashjs"; //xxhash.h32(string, seed).toNumber()

export interface Translation {
  [key: number]: {
    machineTranslation: string;
    semantic: SemanticUnit[];
  };
}

function calcHash(text: string) {
  return xxhash.h32(text, 0).toNumber();
}

export const useTranslationStore = defineStore({
  id: "translationStore",
  // @ts-ignore
  persist: true,
  state: () => ({
    translations: {} as Translation,
  }),
  getters: {
    getFullTranslation: state => (text: string) => {
      const hash = calcHash(text);
      return state.translations[hash] || undefined;
    },
    getMachineTranslation: state => (text: string) => {
      const hash = calcHash(text);
      return state.translations[hash]?.machineTranslation || "";
    },
    getSemantic: state => (text: string | undefined) => {
      if (!text) return;
      const hash = calcHash(text);
      const result = state.translations[hash]?.semantic;
      return Array.isArray(result) && result.length > 0 ? result : undefined;
    },
  },
  actions: {
    setTranslation(
      text: string,
      machineTranslation: string,
      semantic: SemanticUnit[]
    ) {
      const hash = calcHash(text);
      this.translations[hash] = {
        machineTranslation,
        semantic,
      };
    },
    setMachineTranslation(text: string, machineTranslation: string) {
      const hash = calcHash(text);
      this.translations[hash] = {
        ...this.translations[hash],
        machineTranslation,
      };
    },
    setSemantic(text: string | undefined, semantic: SemanticUnit[]) {
      if (!text) return;
      const hash = calcHash(text);
      this.translations[hash] = {
        ...this.translations[hash],
        semantic,
      };
    },
  },
});
