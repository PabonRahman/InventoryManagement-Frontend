export interface PurchaseRequest {
  productId: number;
  supplierId: number;
  storeId: number;
  quantity: number;
  price: number;
  purchaseDate: string | Date;
  description?: string;
}
