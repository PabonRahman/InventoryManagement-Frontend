export interface PurchaseDTO {
product: any;
supplier: any;
store: any;
  id: number;
  productId: number;
  productName: string;
  supplierId: number;
  supplierName: string;
  storeId: number;
  storeName: string;
  quantity: number;
  price: number;
  purchaseDate: string | Date;
  description?: string;
}
