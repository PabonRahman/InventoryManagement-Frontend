// role.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'] as string[];
    
    console.log('👑 RoleGuard checking:', route.routeConfig?.path);
    console.log('👑 Expected roles:', expectedRoles);
    console.log('👑 User roles:', this.authService.getUserRoles());
    
    if (!expectedRoles || expectedRoles.length === 0) {
      console.log('✅ No role requirements, allowing access');
      return true;
    }

    const hasRole = this.authService.hasAnyRole(expectedRoles);
    
    if (!hasRole) {
      console.warn('🚫 Access denied. User does not have required role');
      this.router.navigate(['/unauthorized']);
      return false;
    }

    console.log('✅ User has required role, allowing access');
    return true;
  }
}