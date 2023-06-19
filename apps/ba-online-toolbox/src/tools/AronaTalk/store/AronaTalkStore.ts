import { defineStore } from 'pinia';
import { Character, MessageContentAst } from '../types/ChatContent';

export const useAronaTalkStore = defineStore({
  id: 'aronaTalkStore',
  state: () => {
    return {
      title: 'AronaTalk',
      // contents: [] as ChatContentAst[],
      contents: [] as Array<MessageContentAst[]>,
      characters: [] as Character[],
      currentCharacter: {} as Character,
      currentInputText: '' as string,
      currentInputAst: [] as MessageContentAst[],
    };
  },
  persist: true,
  getters: {
    getCurrentInputText: state => state.currentInputText,
    getCurrentCharacter: state => state.currentCharacter,
  },
  actions: {
    setCurrentInputText(input: string) {
      this.currentInputText = input;
    },
    sendCurrentInputAstToStore() {
      //
    },
  },
});
