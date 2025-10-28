import { Product } from './product';
import { Supplier } from './supplier';
import { Store } from './store';

export interface Purchase {
  id?: number;
  product: Product;
  supplier: Supplier;
  store: Store;
  quantity: number;
  price: number;
  purchaseDate: string | Date;
  description?: string;
}