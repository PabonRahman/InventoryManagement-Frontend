// src/app/models/category.model.ts
export interface Category {
  id?: number;
  name: string;
  description: string;
  productCount: number; // Add this
  products?: any; // Optional - keep if you use it elsewhere
}