import { defineStore } from "pinia";
import { ContentLine, Scenario } from "../types/content";

export type Language =
  | "TextCn"
  | "TextTw"
  | "TextJp"
  | "TextEn"
  | "TextKr"
  | "TextTh";

export const useScenarioStore = defineStore({
  id: "scenarioStore",
  state: () => {
    return {
      fileLoad: false,
      scenario: {} as Scenario,
      title: "",
    };
  },
  persist: true,
  getters: {
    isLoadFile: state => state.fileLoad,
    getScenario: state => state.scenario,
    getGroupId: state => state.scenario.GroupId,
    getTitle: state => state.title,
    getNextLineWhereTextJpIsNotEmpty: state => (line: number) => {
      let nextLine = line + 1;
      while (nextLine < state.scenario.content.length) {
        if (
          state.scenario.content[nextLine].TextJp &&
          state.scenario.content[nextLine].TextJp.length > 0
        ) {
          return nextLine;
        }
        nextLine++;
      }
      return nextLine - 1;
    },
    getPrevLineWhereTextJpIsNotEmpty: state => (line: number) => {
      let prevLine = line - 1;
      while (prevLine >= 0) {
        if (
          state.scenario.content[prevLine].TextJp &&
          state.scenario.content[prevLine].TextJp.length > 0
        ) {
          return prevLine;
        }
        prevLine--;
      }
      return prevLine + 1;
    },
    getProofreader: state => state.scenario.proofreader || "",
  },
  actions: {
    loadFile() {
      this.fileLoad = true;
    },
    unLoadFile() {
      this.fileLoad = false;
    },
    setScenario(scenario: Scenario) {
      this.scenario = scenario;
      this.loadFile();
    },
    setTranslator(translator: string) {
      this.scenario.translator = translator;
    },
    setProofreader(proofreader: string) {
      if (!this.scenario.proofreader) {
        this.scenario = {
          GroupId: this.scenario.GroupId,
          translator: this.scenario.translator,
          proofreader,
          content: this.scenario.content,
        }
      }
      this.scenario.proofreader = proofreader;
    },
    setContentLine(content: ContentLine, line: number) {
      this.scenario.content[line] = content;
    },
    setTitle(title: string) {
      this.title = title;
    },
    clearAll() {
      this.scenario = {} as Scenario;
      this.title = "";
      this.fileLoad = false;
    },
  },
});
