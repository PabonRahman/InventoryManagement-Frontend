import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:8080/api/suppliers';

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    console.log('🔍 Fetching suppliers from:', this.apiUrl);
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
    console.log('🚀 Creating supplier:', supplier);
    return this.http.post<Supplier>(this.apiUrl, supplier).pipe(
      catchError(this.handleError)
    );
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier).pipe(
      catchError(this.handleError)
    );
  }

  deleteSupplier(id: number): Observable<void> {
    console.log('🗑️ Deleting supplier ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('🛑 Supplier Service Error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
      message: error.message
    });

    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check if the backend is running.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized: Please login again';
    } else if (error.status === 403) {
      errorMessage = 'Access denied: You do not have permission to perform this action';
    } else if (error.status === 500) {
      errorMessage = 'Server error: Please check the backend logs';
    }

    return throwError(() => new Error(errorMessage));
  }
}