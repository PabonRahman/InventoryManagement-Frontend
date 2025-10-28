import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🚨 ErrorInterceptor - Monitoring request:', request.url);
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('🚨 ErrorInterceptor caught:', error.status, error.url);
        
        let errorMessage = 'An error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your connection.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized access. Please login again.';
            console.log('🔐 401 detected - logging out and redirecting to login');
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          } else if (error.status === 403) {
            errorMessage = 'Access denied. You do not have permission to access this resource.';
            this.router.navigate(['/unauthorized']);
          } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = `Error: ${error.status} - ${error.statusText}`;
          }
        }
        
        console.error('HTTP Error:', error);
        return throwError(errorMessage);
      })
    );
  }
}