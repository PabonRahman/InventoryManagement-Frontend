import { Store } from './store';
import { Product } from './product';
import { TransactionType } from './transaction-type';

export interface Transaction {
  id?: number;
  store: Store;
  product: Product;
  quantity: number;
  price: number;
  type: TransactionType;
  transactionDate?: string;
  description?: string;
}
