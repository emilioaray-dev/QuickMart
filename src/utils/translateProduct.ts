import type { SupportedLanguage } from "@/i18n";
import type { Product } from "@/types/product";

export const getProductName = (product: Product, language: SupportedLanguage): string => {
  // Fallback to product.name if nameTranslations is not available (backward compatibility)
  if (!product.nameTranslations) {
    return product.name;
  }
  return product.nameTranslations[language] || product.name;
};
