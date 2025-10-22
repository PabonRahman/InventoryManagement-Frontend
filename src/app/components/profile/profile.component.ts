import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: any = null;
  loading = false;
  submitted = false;
  success = '';
  error = '';
  isEditing = false;
  showChangePassword = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Statistics (mock data - you can replace with actual API calls)
  userStats = {
    totalProducts: 0,
    totalPurchases: 0,
    totalSales: 0,
    lastLogin: ''
  };

  // Activity log (mock data)
  recentActivity = [
    { action: 'Logged in', timestamp: new Date(), icon: 'fa-sign-in-alt', color: 'success' },
    { action: 'Viewed products', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), icon: 'fa-eye', color: 'info' },
    { action: 'Updated profile', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), icon: 'fa-user-edit', color: 'warning' }
  ];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadUserStats();
    this.initializeForm();
  }

  initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      // Profile fields
      username: [{ value: this.currentUser?.username || '', disabled: true }],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      
      // Change password fields
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validators: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  // Custom validator for password match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      // Only validate if new password has value
      if (control.value && control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.success = '';
    this.error = '';

    if (this.isEditing) {
      this.profileForm.get('email')?.enable();
    } else {
      this.profileForm.get('email')?.disable();
      this.profileForm.patchValue({
        email: this.currentUser?.email
      });
    }
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.success = '';
    this.error = '';

    if (!this.showChangePassword) {
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      this.profileForm.get('newPassword')?.clearValidators();
      this.profileForm.get('newPassword')?.updateValueAndValidity();
    } else {
      this.profileForm.get('newPassword')?.setValidators([Validators.minLength(6)]);
      this.profileForm.get('newPassword')?.updateValueAndValidity();
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onProfileSubmit(): void {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call - replace with actual update service
    setTimeout(() => {
      // Update user data (in a real app, this would be an API call)
      const updatedUser = {
        ...this.currentUser,
        email: this.f['email'].value
      };

      // Update local storage and subject
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.authService.refreshUserData();

      this.loading = false;
      this.isEditing = false;
      this.success = 'Profile updated successfully!';
      this.profileForm.get('email')?.disable();
      
      // Refresh current user data
      this.currentUser = updatedUser;
    }, 1000);
  }

  onPasswordSubmit(): void {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.profileForm.get('newPassword')?.value && this.profileForm.invalid) {
      return;
    }

    // Check if current password is provided when changing password
    if (this.profileForm.get('newPassword')?.value && !this.profileForm.get('currentPassword')?.value) {
      this.error = 'Current password is required to change password';
      return;
    }

    this.loading = true;

    // Simulate password change API call
    setTimeout(() => {
      this.loading = false;
      this.showChangePassword = false;
      this.success = 'Password changed successfully!';
      
      // Reset password fields
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      this.submitted = false;
    }, 1500);
  }

  loadUserStats(): void {
    // Mock data - replace with actual API calls
    this.userStats = {
      totalProducts: 156,
      totalPurchases: 89,
      totalSales: 234,
      lastLogin: this.formatDate(new Date())
    };
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getRoleDisplay(role: string): string {
    return role.replace('ROLE_', '');
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-danger';
      case 'ROLE_MODERATOR':
        return 'bg-warning text-dark';
      case 'ROLE_USER':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  }

  getInitials(username: string): string {
    return username ? username.charAt(0).toUpperCase() : 'U';
  }

  getAvatarColor(username: string): string {
    const colors = [
      'bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger',
      'bg-secondary', 'bg-dark', 'bg-primary', 'bg-success', 'bg-info'
    ];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  // Export user data (mock functionality)
  exportUserData(): void {
    this.loading = true;
    
    // Simulate export process
    setTimeout(() => {
      const userData = {
        profile: this.currentUser,
        statistics: this.userStats,
        exportDate: new Date().toISOString()
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${this.currentUser.username}-${new Date().getTime()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      this.loading = false;
      this.success = 'User data exported successfully!';
    }, 1000);
  }

  // Get activity time display
  getActivityTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return this.formatDate(timestamp);
  }
}