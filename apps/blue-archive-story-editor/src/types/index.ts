import { BGNameExcelTableItem, CharacterNameExcelTableItem } from "ba-story-player/dist/lib/types/excels";

export type ExcelTableType = "background" | "character";

export type ExcelTable<T> = {
  DataList: T[];
};

type BaseExcelTable = {
  [key in ExcelTableType]: Map<number, unknown>;
};

export interface ActualBaseExcelTable extends BaseExcelTable {
  background: Map<number, BGNameExcelTableItem>;
  character: Map<number, CharacterNameExcelTableItem>;
}

type IExcelTableNameMap = {
  [key in ExcelTableType]: string;
};

export const ExcelTableNameMap: IExcelTableNameMap = {
  background: "ScenarioBGNameExcelTable.json",
  character: "ScenarioCharacterNameExcelTable.json",
};

export type OptionItem = {
  label: string;
  value: string | number;
};
