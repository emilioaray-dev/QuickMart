import appleImg from "@/assets/apple.jpg";
import bananaImg from "@/assets/banana.jpg";
import breadImg from "@/assets/bread.jpg";
import eggsImg from "@/assets/eggs.jpg";
import juiceImg from "@/assets/juice.jpg";
import milkImg from "@/assets/milk.jpg";
import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Fresh Apples",
    nameTranslations: {
      en: "Fresh Apples",
      es: "Manzanas Frescas",
      fr: "Pommes Fraîches",
      de: "Frische Äpfel",
    },
    price: 3.99,
    category: "Fruits",
    image: appleImg,
    barcode: "1234567890123",
  },
  {
    id: "2",
    name: "Organic Milk",
    nameTranslations: {
      en: "Organic Milk",
      es: "Leche Orgánica",
      fr: "Lait Biologique",
      de: "Bio-Milch",
    },
    price: 4.49,
    category: "Dairy",
    image: milkImg,
    barcode: "2234567890123",
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    nameTranslations: {
      en: "Whole Wheat Bread",
      es: "Pan Integral",
      fr: "Pain Complet",
      de: "Vollkornbrot",
    },
    price: 2.99,
    category: "Bakery",
    image: breadImg,
    barcode: "3234567890123",
  },
  {
    id: "4",
    name: "Orange Juice",
    nameTranslations: {
      en: "Orange Juice",
      es: "Jugo de Naranja",
      fr: "Jus d'Orange",
      de: "Orangensaft",
    },
    price: 5.99,
    category: "Beverages",
    image: juiceImg,
    barcode: "4234567890123",
  },
  {
    id: "5",
    name: "Bananas",
    nameTranslations: {
      en: "Bananas",
      es: "Plátanos",
      fr: "Bananes",
      de: "Bananen",
    },
    price: 1.99,
    category: "Fruits",
    image: bananaImg,
    barcode: "5234567890123",
  },
  {
    id: "6",
    name: "Farm Fresh Eggs",
    nameTranslations: {
      en: "Farm Fresh Eggs",
      es: "Huevos Frescos de Granja",
      fr: "Œufs Frais de Ferme",
      de: "Frische Bauernhof-Eier",
    },
    price: 6.49,
    category: "Dairy",
    image: eggsImg,
    barcode: "6234567890123",
  },
];
