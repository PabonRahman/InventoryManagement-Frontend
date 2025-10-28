import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { 
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/user-dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user-dashboard';
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    this.authService.login(this.f['username'].value, this.f['password'].value)
      .subscribe({
        next: (user) => {
          // Login successful
          this.loading = false;
          
          // Show success message
          this.error = '';
          
          // Navigate to return URL or default dashboard
          this.router.navigate([this.returnUrl]);
        },
        error: (error: string) => {
          this.error = error || 'Login failed. Please check your credentials and try again.';
          this.loading = false;
          
          // Clear password field on error
          this.loginForm.patchValue({ password: '' });
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Reset form
  resetForm(): void {
    this.submitted = false;
    this.error = '';
    this.loginForm.reset();
  }

  // Demo credentials for testing
  fillDemoCredentials(role: string): void {
    let username = '';
    let password = 'password123'; // Default password for demo

    switch (role) {
      case 'admin':
        username = 'admin';
        break;
      case 'moderator':
        username = 'moderator';
        break;
      case 'user':
        username = 'user';
        break;
      default:
        username = 'user';
    }

    this.loginForm.patchValue({
      username: username,
      password: password
    });
  }
}