import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:8080/api/suppliers';
  suppliers: Supplier[] = []; // optional for lookup

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier).pipe(
      catchError(this.handleError)
    );
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier).pipe(
      catchError(this.handleError)
    );
  }

  softDeleteSupplier(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ ADD THESE NEW METHODS FOR PRODUCT COUNTS

  // Get supplier product count only
  getSupplierProductCount(id: number): Observable<number> {
    return this.http.get<{productCount: number}>(`${this.apiUrl}/${id}/product-count`).pipe(
      map(response => response.productCount),
      catchError(this.handleError)
    );
  }

  // Check if supplier can be deleted (has no products)
  canDeleteSupplier(id: number): Observable<{canDelete: boolean, productCount: number, message: string}> {
    return this.http.get<{canDelete: boolean, productCount: number, message: string}>(
      `${this.apiUrl}/${id}/can-delete`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get suppliers without product counts (basic info)
  getSuppliersBasic(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/basic`).pipe(
      catchError(this.handleError)
    );
  }

  getSupplierNameById(supplierId: number): string {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : '';
  }

  // ✅ Helper method to check if supplier has products
  hasProducts(supplier: Supplier): boolean {
    return (supplier.productCount || 0) > 0;
  }

  // ✅ Helper method to get product count text
  getProductCountText(supplier: Supplier): string {
    const count = supplier.productCount || 0;
    return count === 1 ? '1 product' : `${count} products`;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Supplier Service Error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}