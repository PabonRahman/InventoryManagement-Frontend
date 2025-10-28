// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('🔐 AuthGuard checking:', state.url);
    
    if (!this.authService.isLoggedIn()) {
      console.log('❌ User not logged in, redirecting to login');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (this.authService.isTokenExpired()) {
      console.log('⏰ Token expired, logging out and redirecting to login');
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    console.log('✅ Authentication valid for:', state.url);
    return true;
  }
}