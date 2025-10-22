import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { TransactionType } from '../models/transaction-type';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(storeId: number, productId: number, quantity: number, price: number, type: TransactionType, description?: string): Observable<Transaction> {
    const params = new HttpParams()
      .set('storeId', storeId)
      .set('productId', productId)
      .set('quantity', quantity)
      .set('price', price)
      .set('type', type)
      .set('description', description || '');

    return this.http.post<Transaction>(this.apiUrl, null, { params });
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
