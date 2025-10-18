import { Category } from './category';
import { Supplier } from './supplier';  // <-- import Supplier

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: Category;
  supplier?: Supplier;  // <-- add supplier
}
