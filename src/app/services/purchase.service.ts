import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:8080/api/purchases';

  constructor(private http: HttpClient) { }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getPurchase(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl, purchase).pipe(
      catchError(this.handleError)
    );
  }

  updatePurchase(id: number, purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.apiUrl}/${id}`, purchase).pipe(
      catchError(this.handleError)
    );
  }

  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
