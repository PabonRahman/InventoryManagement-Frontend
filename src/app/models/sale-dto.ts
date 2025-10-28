export interface SaleDTO {
  productId: number;
  storeId: number;
  quantity: number;
  price: number;
  saleDate: string; // 'yyyy-MM-dd'
  description?: string;
}
