import type { CartItem } from "./product";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: "card" | "cash";
  date: string;
  discount?: number;
  couponCode?: string;
}
