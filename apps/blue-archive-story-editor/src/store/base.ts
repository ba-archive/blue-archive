import { defineStore } from "pinia";
import { NetworkAdapterType } from "@/interface/http";
import { BaseStoreState } from "@/store/type";

const useBaseStore = defineStore({
  id: "setting",
  state: (): BaseStoreState => ({
    adapter: "Localhost",
    theme: {
      themeType: "亮蓝色",
      themeColor: "#2080F0FF",
    },
  }),
  getters: {
    getThemeType: (state: BaseStoreState) => state.theme.themeType,
    getThemeColor: (state: BaseStoreState) => state.theme.themeColor,
  },
  actions: {
    setAdapter(adapter: NetworkAdapterType) {
      this.adapter = adapter;
    },
    setThemeType(type: string) {
      this.theme.themeType = type;
    },
  },
  persist: {
    key: "base",
  },
});

export default useBaseStore;
