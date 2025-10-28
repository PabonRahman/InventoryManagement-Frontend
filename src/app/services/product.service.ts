import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  createProduct(product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (imageFile) formData.append('image', imageFile, imageFile.name);

    return this.http.post<Product>(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // ✅ REGULAR UPDATE (with optional image)
  updateProduct(id: number, product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (imageFile) formData.append('image', imageFile, imageFile.name);

    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // ✅ NEW: SIMPLE UPDATE (without image - for category assignments)
  updateProductSimple(id: number, product: Product): Observable<Product> {
    console.log('🔄 Updating product via simple endpoint:', product);
    console.log('🎯 Category ID being sent:', product.categoryId);
    
    return this.http.put<Product>(`${this.apiUrl}/${id}/simple`, product).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // Alternative to deletion - set product as inactive
  deactivateProduct(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  activateProduct(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/activate`, {}).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('Product Service Error:', error);
    
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error - extract the actual MySQL constraint error
      const serverError = error.error?.error || '';
      
      // Check for MySQL foreign key constraint errors
      if (serverError.includes('Cannot delete or update a parent row') && 
          serverError.includes('foreign key constraint')) {
        
        errorMessage = this.extractConstraintDetails(serverError);
      } 
      // Check for other constraint violations
      else if (serverError.includes('constraint') || serverError.includes('reference')) {
        errorMessage = 'This product cannot be deleted because it is referenced in other parts of the system (orders, inventory, sales, etc.).';
      }
      // Handle other HTTP status codes
      else if (error.status === 500) {
        errorMessage = 'Internal server error - Please try again later';
      } else if (error.status === 404) {
        errorMessage = 'Product not found';
      } else if (error.status === 400) {
        errorMessage = 'Bad request - Invalid data provided';
      } else if (error.status === 413) {
        errorMessage = 'File too large - Please choose a smaller image';
      } else if (error.status === 415) {
        errorMessage = 'Unsupported file type - Please use JPEG, PNG, or GIF images';
      } else {
        // Fallback to existing error message extraction
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private extractConstraintDetails(errorMessage: string): string {
    // Parse the MySQL constraint error to provide specific guidance
    if (errorMessage.includes('purchase_order_items') || errorMessage.includes('purchase_orders')) {
      return 'Product cannot be deleted because it is used in purchase orders. Please remove this product from all purchase orders first.';
    } else if (errorMessage.includes('sale_items') || errorMessage.includes('sales')) {
      return 'Product cannot be deleted because it is used in sales records. Please remove this product from all sales transactions first.';
    } else if (errorMessage.includes('inventory_transactions') || errorMessage.includes('inventory')) {
      return 'Product cannot be deleted because it has inventory transactions. Please clear all inventory records for this product first.';
    } else if (errorMessage.includes('order_items') || errorMessage.includes('orders')) {
      return 'Product cannot be deleted because it is included in customer orders. Please remove this product from all orders first.';
    } else {
      // Generic constraint message with detailed guidance
      return `Product cannot be deleted because it is referenced in other parts of the system.

This product is currently being used in:
• Purchase orders (supplier orders)
• Sales transactions (customer sales)
• Inventory records (stock movements)
• Customer orders (pending/completed orders)

Required actions before deletion:
1. Remove product from all purchase orders
2. Delete sales records containing this product
3. Clear inventory transactions
4. Remove from customer orders

Alternative: Set product status to "DISCONTINUED" instead of deleting to preserve historical data.`;
    }
  }
}