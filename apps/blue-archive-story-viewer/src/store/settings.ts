import { defineStore } from "pinia";
import { Language } from "@/types/Settings";
import { StudentAttributeFilters, StudentFilters } from "@/types/Student";

export const useSettingsStore = defineStore({
  id: "ba-main-storage",
  state: () => {
    return {
      currentVersion: {
        lastUpdated: 0,
      },
      settings: {
        disableMomotalkAnimation: false,
        lang: "cn" as Language,
        enableCheckForUpdates: true,
        theme: "light" as "light" | "dark",
        username: "Sensei" as string,
        useMp3: false,
        useSuperSampling: "" as "" | "2" | "4",
      },
      studentFilters: {
        searchString: "",
        rarity: [] as number[],
        club: [] as string[],
        affiliation: [] as string[],
        type: [] as ("Striker" | "Special")[],
        armorType: [] as (
          | "LightArmor"
          | "HeavyArmor"
          | "Unarmed"
          | "ElasticArmor"
        )[],
        bulletType: [] as ("Pierce" | "Explode" | "Mystic" | "Sonic")[],
      },
      app: {
        width: 1920,
        height: 1080,
      },
    };
  },
  persist: true,
  getters: {
    getLastUpdated: state => state.currentVersion.lastUpdated,
    getAppSize: state => state.app,
    getDisableMomotalkAnimationState: state =>
      state.settings.disableMomotalkAnimation ?? false,
    getLang: state => state.settings.lang,
    getTheme: state => state.settings.theme,
    getUsername: state => state.settings.username,
    getSearchStringFilter: state => state.studentFilters.searchString,
    getRarityFilter: state => state.studentFilters.rarity,
    getClubFilter: state => state.studentFilters.club,
    getAffiliationFilter: state => state.studentFilters.affiliation,
    getTypeFilter: state => state.studentFilters.type,
    getArmorTypeFilter: state => state.studentFilters.armorType,
    getBulletTypeFilter: state => state.studentFilters.bulletType || [],
    getEnableCheckForUpdates: state => state.settings.enableCheckForUpdates,
    getUseMp3: state => state.settings.useMp3,
    getUseSuperSampling: state => {
      const shouldUseSuperSampling = state.settings.useSuperSampling;
      if (!["", "2", "4"].includes(shouldUseSuperSampling)) {
        return "";
      }
      return shouldUseSuperSampling;
    },
  },
  actions: {
    setLastUpdated(lastUpdated: number) {
      this.currentVersion.lastUpdated = lastUpdated;
    },
    setAppSize(width: number, height: number) {
      this.app.width = width;
      this.app.height = height;
    },
    setDisableMomotalkAnimationState(state: boolean) {
      this.settings.disableMomotalkAnimation = state;
    },
    setLang(lang: "cn" | "tw" | "jp" | "en" | "kr" | "th") {
      this.settings.lang = lang;
    },
    setTheme(theme: "light" | "dark") {
      this.settings.theme = theme;
    },
    setUsername(username: string) {
      this.settings.username = username;
    },
    setEnableCheckForUpdates(state: boolean) {
      this.settings.enableCheckForUpdates = state;
    },
    setStudentFilters(filters: StudentFilters) {
      this.studentFilters.searchString = filters.searchString;
      this.studentFilters.rarity = filters.rarity;
      this.studentFilters.club = filters.club;
      this.studentFilters.affiliation = filters.affiliation;
      this.studentFilters.type = filters.type;
      this.studentFilters.armorType = filters.armorType;
      this.studentFilters.bulletType = filters.bulletType || [];
    },
    clearStudentFilters() {
      this.studentFilters.searchString = "";
      this.studentFilters.rarity = [];
      this.studentFilters.club = [];
      this.studentFilters.affiliation = [];
      this.studentFilters.type = [];
      this.studentFilters.armorType = [];
      this.studentFilters.bulletType = [];
    },
    clearStudentFilter(property: keyof StudentAttributeFilters) {
      this.studentFilters[property] = [];
    },
    setUseMp3(useMp3: boolean) {
      this.settings.useMp3 = useMp3;
    },
    setUseSuperSampling(useSuperSampling: "" | "2" | "4") {
      this.settings.useSuperSampling = useSuperSampling;
    },
  },
});
