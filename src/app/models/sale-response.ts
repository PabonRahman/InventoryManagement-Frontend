import type { Product } from "./product";
import type { Store } from "./store";

export interface SaleResponse {
  product: Product | undefined;
  store: Store | undefined;
  id: number;
  productName: string;
  categoryName: string;
  storeName: string;
  quantity: number;
  price: number;
  saleDate: string;
  description?: string;
}