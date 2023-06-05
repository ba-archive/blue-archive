export interface AppliedFilter {
  searchString: string;
  rarity: number[];
  club: string[];
  affiliation: string[];
  type: ('Striker' | 'Special')[];
  armorType: ('LightArmor' | 'HeavyArmor' | 'Unarmed')[];
  bulletType?: ('Pierce' | 'Explode' | 'Mystic')[];
}
