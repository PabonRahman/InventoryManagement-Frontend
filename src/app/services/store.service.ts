import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../models/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private apiUrl = 'http://localhost:8080/api/stores';

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }

  getStore(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`);
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, store);
  }

  updateStore(id: number, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, store);
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
