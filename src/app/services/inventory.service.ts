import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = 'http://localhost:8080/api/inventories';

  constructor(private http: HttpClient) { }

  getInventories(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getInventory(storeId: number, productId: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/store/${storeId}/product/${productId}`);
  }

  createOrUpdateInventory(storeId: number, productId: number, quantity: number, costPrice: number): Observable<Inventory> {
    const params = new HttpParams()
      .set('storeId', storeId)
      .set('productId', productId)
      .set('quantity', quantity)
      .set('costPrice', costPrice);

    return this.http.post<Inventory>(this.apiUrl, null, { params });
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
