import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '../models/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = 'http://localhost:8080/api/stores';

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getStore(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, store).pipe(
      catchError(this.handleError)
    );
  }

  updateStore(id: number, store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, store).pipe(
      catchError(this.handleError)
    );
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // FIXED: Proper implementation of getStoreNameById
  getStoreNameById(storeId: number): Observable<string> {
    return this.getStore(storeId).pipe(
      map(store => store.name),
      catchError(() => of('Unknown Store'))
    );
  }

  private handleError(error: any) {
    console.error('Store Service Error:', error);

    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}