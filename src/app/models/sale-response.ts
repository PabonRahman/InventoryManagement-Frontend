export interface SaleResponse {
  product: import("c:/Users/User/InventoryManagement-Frontend/src/app/models/product").Product | undefined;
  store: import("c:/Users/User/InventoryManagement-Frontend/src/app/models/store").Store | undefined;
  id: number;
  productName: string;
  categoryName: string; // ✅ matches backend
  storeName: string;
  quantity: number;
  price: number;
  saleDate: string;
  description?: string;
}
