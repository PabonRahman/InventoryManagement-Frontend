import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8080/api/sales';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getSale(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, sale).pipe(
      catchError(this.handleError)
    );
  }

  updateSale(id: number, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/${id}`, sale).pipe(
      catchError(this.handleError)
    );
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
