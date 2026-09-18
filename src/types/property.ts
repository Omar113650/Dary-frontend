export interface Property {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  location: {
    ar: string;
    en: string;
  };
  type: {
    ar: string;
    en: string;
  };
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
}

export interface SearchOption {
  value: string;
  label: {
    ar: string;
    en: string;
  };
}
