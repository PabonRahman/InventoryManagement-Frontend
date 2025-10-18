import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();

    // Send the whole product object as JSON string
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Product>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }


  createProduct2(product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description || '');
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('categoryId', product.category?.id?.toString() || '');
    formData.append('supplierId', product.supplier?.id?.toString() || ''); // <-- add supplier

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Product>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Product, imageFile?: File): Observable<Product> {
  const formData = new FormData();

  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

  // If using individual fields:
  // formData.append('supplierId', product.supplier?.id?.toString() || '');

  if (imageFile) {
    formData.append('image', imageFile);
  }

  return this.http.put<Product>(`${this.apiUrl}/${id}`, formData).pipe(
    catchError(this.handleError)
  );
}



  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 500) {
        errorMessage = 'Server error: Please check the backend logs';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}