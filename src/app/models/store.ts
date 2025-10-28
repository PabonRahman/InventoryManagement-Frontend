export interface Store {
  id?: number;
  name: string;
  address?: string;
  contactNumber?: string;
  isActive?: boolean;
  productCount?: number;    // Add this
  purchaseCount?: number;  // Add this
  saleCount?: number;      // Add this
  products?: any;          // Keep if needed for detailed views
  purchases?: any;         // Keep if needed for detailed views
  sales?: any;             // Keep if needed for detailed views
}