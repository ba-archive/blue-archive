import { defineStore } from 'pinia';
import {
  ContentTranslation,
  FileContent,
  TitleTranslation,
} from '../types/FileContent';

export const useMainStore = defineStore({
  id: 'translation',
  state: () => {
    return {
      fileContent: {} as FileContent,
      studentId: 0,
      studentName: '',
      proofread: false,
      proofreader: '',
      globalReferenceMode: false,
    };
  },
  persist: true,
  getters: {
    getMomotalkTitles: state => state.fileContent.title,
    getMomotalkContents: state => state.fileContent.content,
    getStudentId: state => state.studentId,
    getStudentName: state => state.studentName,
    getFileContent: state => state.fileContent,
    getTranslator: state =>
      state.fileContent.translator || state.fileContent.translate || '',
    getProofreadState: state => state.proofread,
    getProofreader: state => state.proofreader,
    getGlobalReferenceMode: state => state.globalReferenceMode,
  },
  actions: {
    setFileContent(content: FileContent) {
      this.clearAll();
      this.fileContent = content;
      this.studentId = content.CharacterId;
      this.studentName = '';
    },
    setStudentName(name: string | undefined) {
      if (undefined !== name) {
        this.studentName = name;
      }
    },
    clearAll() {
      this.fileContent = {} as FileContent;
      this.studentId = 0;
    },
    updateTranslator(translator: string) {
      if (undefined !== this.fileContent.translate) {
        try {
          delete this.fileContent.translate;
        } catch (e) {
          console.log(e);
        }
      }
      this.fileContent.translator = translator;
    },
    updateTitle(index: number | undefined, content: TitleTranslation) {
      if (undefined !== index) {
        this.fileContent.title[index].TextJp = content.TextJp;
        this.fileContent.title[index].TextCn = content.TextCn;
        this.fileContent.title[index].TextKr = content.TextKr;
        this.fileContent.title[index].TextEn = content.TextEn;
        this.fileContent.title[index].TextTh = content.TextTh;
        this.fileContent.title[index].TextTw = content.TextTw;
        this.fileContent.title[index].unsure = content.unsure;
      }
    },
    updateMomotalk(id: number | undefined, content: ContentTranslation) {
      if (undefined !== id) {
        const index = this.fileContent.content.findIndex(
          content => content.Id === id
        );
        if (index !== -1) {
          this.fileContent.content[index].MessageJP = content.MessageJP;
          this.fileContent.content[index].MessageCN = content.MessageCN;
          this.fileContent.content[index].MessageKR = content.MessageKR;
          this.fileContent.content[index].MessageEN = content.MessageEN;
          this.fileContent.content[index].MessageTH = content.MessageTH;
          this.fileContent.content[index].MessageTW = content.MessageTW;
          this.fileContent.content[index].unsure = content.unsure;
        }
      }
    },
    updateProofreadState(state: boolean) {
      this.proofread = state;
    },
    updateProofreader(proofreader: string) {
      this.proofreader = proofreader;
    },
    updateGlobalReferenceMode(value: boolean) {
      this.globalReferenceMode = value;
    },
  },
});
