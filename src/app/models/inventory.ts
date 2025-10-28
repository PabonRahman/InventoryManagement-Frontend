import { Store } from "./store";
import { Product } from "./product";

export interface Inventory {
  id?: number;
  store: Store;
  product: Product;
  quantity: number;
  costPrice: number;
}
