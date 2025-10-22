import { Product } from './product';

export interface Sale {
  id?: number;
  product: Product;
  quantity: number;
  price: number;       // price per unit
  saleDate: string | Date;
  description?: string;
}
