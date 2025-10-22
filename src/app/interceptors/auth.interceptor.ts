import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login/register endpoints
    if (req.url.includes('/api/auth/')) {
      return next.handle(req);
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const token = currentUser?.accessToken;

    console.log('🔐 AuthInterceptor - URL:', req.url);
    console.log('🔐 AuthInterceptor - Token found:', !!token);

    if (token) {
      console.log('✅ Adding Authorization header to:', req.url);
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedReq);
    }

    console.log('❌ No token available for:', req.url);
    return next.handle(req);
  }
}