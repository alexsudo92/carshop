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

export type CarSpecs = {
  body: string;
  drivetrain: string;
  acceleration: string;
  topSpeed: string;
  consumption: string;
  transmission: string;
};

export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  heroImage: string;
  description: string;
  specs: CarSpecs;
  highlights: string[];
  engineOptions: EngineOption[];
  colors: ColorOption[];
  wheels: ConfigOption[];
  interior: ConfigOption[];
  packages: ConfigOption[];
};

export type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  password: string;
  birthDate: string;
  paymentMethods: string[];
};
