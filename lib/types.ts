export type ConfigOption = {
  id: string;
  name: string;
  priceModifier: number;
};

export type ColorOption = ConfigOption & {
  hex: string;
};

export type EngineOption = ConfigOption & {
  power: string;
};

export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  heroImage: string;
  gallery: string[];
  description: string;
  engineOptions: EngineOption[];
  colors: ColorOption[];
  wheels: ConfigOption[];
  interior: ConfigOption[];
  packages: ConfigOption[];
};
