// models/product.ts - MINIMAL VERSION
export interface Product {
  categoryName: any;
  supplierName: any;
  storeName: any;
  // Mandatory
  name: string;
  price: number;
  quantity: number;
  description: string;
  
  // Optional
  id?: number;
  imageUrl?: string;
  categoryId?: number;
  supplierId?: number;
  storeId?: number;
}