import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';

  roles = [
    { value: 'ROLE_USER', label: 'User', description: 'Basic access to view products and make purchases' },
    { value: 'ROLE_MODERATOR', label: 'Moderator', description: 'Can manage products, categories, and suppliers' },
    { value: 'ROLE_ADMIN', label: 'Administrator', description: 'Full system access and user management' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { 
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/user-dashboard']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required],
      roles: [['ROLE_USER'], Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });

    // Subscribe to password changes for strength indicator
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordStrength(password);
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  // Custom password strength validator
  passwordStrengthValidator(control: AbstractControl) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = 
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);

    return strength >= 2 ? null : { passwordWeak: true };
  }

  // Check password strength for visual indicator
  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = '';
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = 
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChar ? 1 : 0) +
      (isLongEnough ? 1 : 0);

    if (strength <= 2) {
      this.passwordStrength = 'weak';
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  // Custom validator for password match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }

    this.loading = true;

    const formData = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      roles: this.f['roles'].value
    };

    this.authService.register(
      formData.username,
      formData.email,
      formData.password,
      formData.roles
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting to login...';
        
        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login'], { 
            queryParams: { 
              registered: true,
              username: formData.username 
            } 
          });
        }, 3000);
      },
      error: (error) => {
        this.error = error || 'Registration failed. Please try again.';
        this.loading = false;
        
        // Clear password fields on error
        this.registerForm.patchValue({ 
          password: '',
          confirmPassword: '' 
        });
        this.passwordStrength = '';
      }
    });
  }

  // Scroll to first invalid control
  private scrollToFirstInvalidControl(): void {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Reset form
  resetForm(): void {
    this.submitted = false;
    this.error = '';
    this.success = '';
    this.passwordStrength = '';
    this.registerForm.reset({
      roles: ['ROLE_USER']
    });
  }

  // Check if role is selected
  isRoleSelected(role: string): boolean {
    const selectedRoles = this.f['roles'].value;
    return selectedRoles.includes(role);
  }

  // Toggle role selection
  toggleRole(role: string): void {
    const selectedRoles = this.f['roles'].value;
    const index = selectedRoles.indexOf(role);

    if (index > -1) {
      // Remove role if already selected
      selectedRoles.splice(index, 1);
    } else {
      // Add role if not selected
      selectedRoles.push(role);
    }

    this.registerForm.patchValue({ roles: selectedRoles });
  }

  // Get password strength text
  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  }

  // Get password strength class
  getPasswordStrengthClass(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'password-weak';
      case 'medium': return 'password-medium';
      case 'strong': return 'password-strong';
      default: return '';
    }
  }
}