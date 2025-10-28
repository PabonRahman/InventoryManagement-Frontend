export interface Supplier {
  id?: number;
  name: string;
  contactEmail?: string;
  phone: string;
  address?: string;
  products?: any[];
  isActive?: boolean; // soft delete flag
  
  // ✅ MAKE SURE THIS FIELD EXISTS
  productCount?: number;
}