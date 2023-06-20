import { BGNameExcelTableItem, CharacterNameExcelTableItem } from "ba-story-player/dist/lib/types/excels";
import service from "@/api/http";

const StoryApi = {
  fetchBackgroundNameExcelTable() {
    return service.excel("background").then((data) => {
      const map = new Map<number, BGNameExcelTableItem>();
      data.DataList.filter((it) => it.BGType === "Image")
        .filter((it) => it.BGFileName)
        .forEach((it) => {
          map.set(it.Name, it);
        });
      return map;
    });
  },
  fetchCharacterNameExcelTable() {
    return service.excel("character").then((data) => {
      const map = new Map<number, CharacterNameExcelTableItem>();
      data.DataList.forEach((it) => {
        map.set(it.CharacterName, it);
      });
      return map;
    });
  },
};

export default StoryApi;
