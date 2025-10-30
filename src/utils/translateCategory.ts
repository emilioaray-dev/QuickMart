import type { Translation } from "@/i18n";

export const translateCategory = (category: string, t: Translation): string => {
  const categoryMap: Record<
    string,
    keyof Pick<
      Translation,
      | "fruits"
      | "dairy"
      | "bakery"
      | "beverages"
      | "meatSeafood"
      | "vegetables"
      | "snacks"
      | "frozenFoods"
      | "pantry"
    >
  > = {
    Fruits: "fruits",
    Dairy: "dairy",
    Bakery: "bakery",
    Beverages: "beverages",
    "Meat & Seafood": "meatSeafood",
    Vegetables: "vegetables",
    Snacks: "snacks",
    "Frozen Foods": "frozenFoods",
    Pantry: "pantry",
  };

  const key = categoryMap[category];
  return key ? t[key] : category;
};
