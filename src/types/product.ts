export interface ProductTranslations {
  en: string;
  es: string;
  fr: string;
  de: string;
}

export interface Product {
  id: string;
  name: string; // Default name (English)
  nameTranslations?: ProductTranslations; // Optional for backward compatibility
  price: number;
  category: string;
  image: string;
  barcode: string;
}

export interface CartItem extends Product {
  quantity: number;
}
