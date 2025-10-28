import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PurchaseDTO } from '../models/PurchaseDTO';
import { PurchaseRequest } from '../models/purchase-request';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:8080/api/purchases';

  constructor(private http: HttpClient) { }

  getPurchases(): Observable<PurchaseDTO[]> {
    return this.http.get<PurchaseDTO[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getPurchase(id: number): Observable<PurchaseDTO> {
    return this.http.get<PurchaseDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  createPurchase(purchaseRequest: PurchaseRequest): Observable<PurchaseDTO> {
    return this.http.post<PurchaseDTO>(this.apiUrl, purchaseRequest).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updatePurchase(id: number, purchaseRequest: PurchaseRequest): Observable<PurchaseDTO> {
    return this.http.put<PurchaseDTO>(`${this.apiUrl}/${id}`, purchaseRequest).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // Enhanced error handling with specific 405 handling
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('Purchase Service Error:', error);
    
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error with specific handling for 405
      switch (error.status) {
        case 405:
          errorMessage = this.getMethodNotAllowedMessage(error);
          break;
        case 404:
          errorMessage = 'Purchase not found';
          break;
        case 400:
          errorMessage = 'Bad request - Invalid purchase data provided';
          break;
        case 500:
          errorMessage = 'Internal server error - Please try again later';
          break;
        default:
          // Try to extract meaningful message
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else {
            errorMessage = `Error ${error.status}: ${error.statusText}`;
          }
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private getMethodNotAllowedMessage(error: HttpErrorResponse): string {
    const url = error.url || '';
    const method = this.getHttpMethodFromUrl(url);
    
    if (url.includes('/api/purchases/') && method === 'PUT') {
      return `Cannot update purchase. The purchase may be:
• Already completed or finalized
• Linked to inventory transactions
• In a status that prevents modifications
• Require administrative approval for changes

Please create a new purchase instead.`;
    }
    
    return `Method not allowed - The operation is not permitted. Please check if the resource supports this action.`;
  }

  private getHttpMethodFromUrl(url: string): string {
    if (url.includes('/api/purchases/')) {
      // If URL has an ID, it's likely PUT, DELETE, or GET with ID
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      if (!isNaN(Number(lastPart))) {
        return 'PUT'; // Assuming update operation
      }
    }
    return 'UNKNOWN';
  }
}