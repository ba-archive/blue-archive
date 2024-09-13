export interface ColorPalette {
  color: string;
  darkColor?: string;
  token?: string;
  description?: string;
}

export interface PaletteProps extends ColorPalette {
  primary?: boolean;
  background?: boolean | string;
}

export interface PaletteGroup {
  token?: string;
  description?: string;
  primary?: boolean;
  background?: boolean | string;
  palettes: ColorPalette[];
}
