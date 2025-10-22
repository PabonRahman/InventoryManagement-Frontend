import { Product } from './product';
import { Supplier } from './supplier';

export interface Purchase {
  id?: number;
  product: Product;
  supplier: Supplier;
  quantity: number;
  price: number;
  purchaseDate: string | Date;
  description?: string;
}
