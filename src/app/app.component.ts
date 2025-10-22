import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;
  roles: string[] = [];
  currentRoute = '';
  isSidebarCollapsed = false;
getRoleBadgeClass: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🚀 AppComponent initialized');
    
    // Subscribe to authentication state changes
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || null;
      this.roles = user?.roles || [];
      console.log('👤 Auth state updated - Logged in:', this.isLoggedIn, 'User:', this.username, 'Roles:', this.roles);
    });

    // Track current route for active menu highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects || event.url;
        console.log('📍 Route changed to:', this.currentRoute);
      });

    // Refresh user data on app initialization
    this.authService.refreshUserData();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  logout(): void {
    console.log('🚪 Logging out user:', this.username);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Check if the current route matches for active styling
  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  // Toggle sidebar collapse
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Get user display name
  getDisplayName(): string {
    return this.username || 'User';
  }

  // Check if user has admin role
  get isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  // Check if user has moderator role
  get isModerator(): boolean {
    return this.hasRole('ROLE_MODERATOR');
  }

  // Get role display name
  getRoleDisplay(role: string): string {
    return role.replace('ROLE_', '');
  }
}