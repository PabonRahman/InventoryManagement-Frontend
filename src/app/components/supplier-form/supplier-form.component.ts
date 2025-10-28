import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {
  @ViewChild('supplierForm') supplierForm!: NgForm;

  supplier: Supplier = {
    name: '',
    phone: '',
    contactEmail: '',
    address: '',
    products: [],
    isActive: true
  };

  isEditMode = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSupplier(Number(id));
    }
  }

  loadSupplier(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        // Check if supplier is active
        if ((supplier as any).isActive === false) {
          this.errorMessage = 'This supplier has been deleted and cannot be edited.';
          setTimeout(() => {
            this.router.navigate(['/suppliers']);
          }, 2000);
          return;
        }

        this.supplier = {
          id: supplier.id,
          name: supplier.name || '',
          contactEmail: supplier.contactEmail || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          products: supplier.products || [],
          isActive: (supplier as any).isActive !== false,
          productCount: supplier.productCount
        };
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading supplier:', error);
        this.errorMessage = this.extractErrorMessage(error);
        this.loading = false;
        
        // Redirect if supplier not found
        if (error.status === 404) {
          setTimeout(() => {
            this.router.navigate(['/suppliers']);
          }, 3000);
        }
      }
    });
  }

  saveSupplier(): void {
    // Check if form is valid
    if (this.supplierForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    // Additional validation with safe string access
    if (!this.isValidEmail(this.supplier.contactEmail)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!this.isValidPhone(this.supplier.phone)) {
      this.errorMessage = 'Please enter a valid phone number (10-15 digits).';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const saveOperation = this.isEditMode
      ? this.supplierService.updateSupplier(this.supplier.id!, this.supplier)
      : this.supplierService.createSupplier(this.supplier);

    saveOperation.subscribe({
      next: (savedSupplier) => {
        this.loading = false;
        
        // Show success message
        this.successMessage = this.isEditMode
          ? `Supplier "${savedSupplier.name}" updated successfully!`
          : `Supplier "${savedSupplier.name}" created successfully!`;
        
        // Redirect after delay
        setTimeout(() => {
          this.router.navigate(['/suppliers']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error saving supplier:', error);
        this.errorMessage = this.extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    if (this.supplierForm.dirty) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    this.router.navigate(['/suppliers']);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
  }

  // Mark all form controls as touched to trigger validation messages
  private markFormGroupTouched(): void {
    if (this.supplierForm && this.supplierForm.controls) {
      Object.keys(this.supplierForm.controls).forEach(key => {
        const control = this.supplierForm.controls[key];
        control.markAsTouched();
      });
    }
  }

  // FIXED: Handle string | undefined properly
  private isValidEmail(email: string | undefined): boolean {
    if (!email) return false; // Email is required
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  // FIXED: Handle string | undefined properly
  private isValidPhone(phone: string | undefined): boolean {
    if (!phone) return false;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.trim());
  }

  private extractErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm?.controls[fieldName];
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.supplierForm?.controls[fieldName];
    if (!field || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return 'This field is required';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['email']) return 'Invalid email address';

    return 'Invalid value';
  }
}