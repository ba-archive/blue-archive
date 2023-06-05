/* eslint-disable sort-exports/sort-exports */

export interface Student {
  id: number;
  familyName: StudentName;
  name: StudentName;
  nickname: string[] | number[];
  club: string;
  affiliation: string;
  birthday?: {
    month: number;
    day: number;
  };
  rarity: number;
  type: 'Striker' | 'Special';
  armorType: 'LightArmor' | 'HeavyArmor' | 'Unarmed';
  bulletType?: 'Pierce' | 'Explode' | 'Mystic';
  weapon:
    | 'SG'
    | 'SMG'
    | 'AR'
    | 'GL'
    | 'HG'
    | 'RL'
    | 'SR'
    | 'RG'
    | 'MG'
    | 'MT'
    | 'FT';
}

export interface StudentName {
  cn: string;
  jp: string;
  en: string;
}

export interface StudentAttributeFilters {
  rarity: number[];
  club: string[];
  affiliation: string[];
  type: string[];
  armorType: string[];
  bulletType?: string[];
}

export interface StudentAttributes {
  club: string;
  affiliation: string;
  rarity: number;
  type: 'Striker' | 'Special';
  armorType: 'LightArmor' | 'HeavyArmor' | 'Unarmed';
  bulletType?: 'Pierce' | 'Explode' | 'Mystic';
  weapon:
    | 'SG'
    | 'SMG'
    | 'AR'
    | 'GL'
    | 'HG'
    | 'RL'
    | 'SR'
    | 'RG'
    | 'MG'
    | 'MT'
    | 'FT';
}

export interface StudentFilters {
  searchString: string;
  rarity: number[];
  club: string[];
  affiliation: string[];
  type: ('Striker' | 'Special')[];
  armorType: ('LightArmor' | 'HeavyArmor' | 'Unarmed')[];
  bulletType?: ('Pierce' | 'Explode' | 'Mystic')[];
}

export interface StudentNames {
  id: number;
  allNames: (string | number)[];
}
