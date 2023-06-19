/* eslint-disable sort-exports/sort-exports */

export interface Student {
  id: number;
  familyName: StudentName;
  name: StudentName;
  nickname: string[] | number[];
  club: string;
  affiliation: string;
  rarity: number;
  type: string;
  armorType: string;
  weapon: string;
}

export interface StudentName {
  cn: string;
  jp: string;
  en: string;
}
