import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getCategoryNameById(categoryId: number): Observable<string> {
    return this.http.get<Category>(`${this.apiUrl}/${categoryId}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(category => category.name)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('Category Service Error:', error);
    
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      console.log('Full error response:', error);
      
      switch (error.status) {
        case 400:
          // Try to extract meaningful message from different response formats
          errorMessage = this.extractErrorMessage(error);
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private extractErrorMessage = (error: HttpErrorResponse): string => {
    // Handle different backend error response formats
    
    // If error.error is a string
    if (typeof error.error === 'string') {
      return error.error;
    }
    
    // If error.error is an object with a message property
    if (error.error && error.error.message) {
      return error.error.message;
    }
    
    // If error.error is an object with a error property
    if (error.error && error.error.error) {
      return error.error.error;
    }
    
    // Spring Boot default error structure
    if (error.error && error.error.details) {
      return error.error.details;
    }

    // Check for validation errors array
    if (error.error && Array.isArray(error.error)) {
      return error.error.join(', ');
    }

    // Check for common Spring Boot error formats
    if (error.error && error.error.path && error.error.timestamp) {
      return `Server error at ${error.error.path}`;
    }
    
    // Generic 400 message
    return 'Bad request - Category may be in use or invalid data provided';
  }
}