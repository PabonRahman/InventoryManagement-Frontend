import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SaleResponse } from '../models/sale-response';
import { SaleDTO } from '../models/sale-dto';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8080/api/sales';

  constructor(private http: HttpClient) {}

  // ✅ Return DTO-based response for GET
  getSales(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getSale(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // POST and PUT still use SaleDTO
  createSale(saleDTO: SaleDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, saleDTO).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updateSale(id: number, saleDTO: SaleDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, saleDTO).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('🔴 Sale Service Error:', error);
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.message || 'Unknown error'}`;
    }

    return throwError(() => new Error(errorMessage));
  };
}
