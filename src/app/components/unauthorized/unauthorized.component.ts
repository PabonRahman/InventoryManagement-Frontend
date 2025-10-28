import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  currentUser: any = null;
  requestedUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    // Get the requested URL from query parameters
    this.route.queryParams.subscribe(params => {
      this.requestedUrl = params['returnUrl'] || '/';
    });
  }

  goToDashboard(): void {
    if (this.authService.isLoggedIn()) {
      // Redirect based on user role
      if (this.authService.hasRole('ROLE_ADMIN')) {
        this.router.navigate(['/admin-dashboard']);
      } else if (this.authService.hasRole('ROLE_MODERATOR')) {
        this.router.navigate(['/mod-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  contactSupport(): void {
    // In a real app, this would open a support ticket or email
    alert('Please contact system administrator for access permissions.');
  }

  getRoleDisplay(role: string): string {
    return role.replace('ROLE_', '');
  }

  getUserRoles(): string[] {
    return this.currentUser?.roles || [];
  }

  hasMultipleRoles(): boolean {
    return this.getUserRoles().length > 1;
  }
}