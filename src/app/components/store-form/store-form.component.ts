import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../../models/store';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent implements OnInit {
  store: Store = {
    name: '',
    address: '',
    contactNumber: '',
    isActive: true
  };
  
  isEditMode = false;
  loading = false;
  errorMessage = '';
  originalStoreName = '';
  originalStoreAddress = '';
  originalContactNumber = '';

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadStore(Number(id));
    }
  }

  loadStore(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.storeService.getStore(id).subscribe({
      next: (store) => {
        this.store = { ...store };
        this.originalStoreName = store.name;
        this.originalStoreAddress = store.address || '';
        this.originalContactNumber = store.contactNumber || '';
        this.loading = false;
        
        console.log('Loaded store with counts:', {
          products: store.productCount,
          purchases: store.purchaseCount,
          sales: store.saleCount
        });
      },
      error: (error) => {
        console.error('Error loading store:', error);
        this.errorMessage = 'Error loading store: ' + error.message;
        this.loading = false;
      }
    });
  }

  saveStore(): void {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // Prepare store data with safe property access
    const storeData: Store = {
      name: this.store.name.trim(),
      address: this.store.address?.trim() || '', // Safe access with fallback
      contactNumber: this.store.contactNumber?.trim() || '', // Safe access with fallback
      isActive: this.store.isActive ?? true // Safe access with fallback
    };

    if (this.isEditMode && this.store.id) {
      storeData.id = this.store.id;
    }

    const saveOperation = this.isEditMode 
      ? this.storeService.updateStore(this.store.id!, storeData)
      : this.storeService.createStore(storeData);

    saveOperation.subscribe({
      next: (savedStore) => {
        this.loading = false;
        this.router.navigate(['/stores']);
      },
      error: (error) => {
        console.error('Error saving store:', error);
        this.errorMessage = this.getUserFriendlyError(error);
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    const name = this.store.name?.trim(); // Safe access

    if (!name) {
      this.errorMessage = 'Store name is required';
      return false;
    }

    if (name.length < 2) {
      this.errorMessage = 'Store name must be at least 2 characters long';
      return false;
    }

    if (name.length > 50) {
      this.errorMessage = 'Store name cannot exceed 50 characters';
      return false;
    }

    // Safe access with optional chaining
    if (this.store.contactNumber && !this.isValidPhoneNumber(this.store.contactNumber)) {
      this.errorMessage = 'Please enter a valid phone number (digits only, 7-15 characters)';
      return false;
    }

    // Safe access with optional chaining
    if (this.store.address && this.store.address.length > 200) {
      this.errorMessage = 'Address cannot exceed 200 characters';
      return false;
    }

    return true;
  }

  private getUserFriendlyError(error: any): string {
    if (error.message?.includes('already exists')) {
      return 'A store with this name already exists';
    }
    
    if (error.message?.includes('Store not found')) {
      return 'Store not found. It may have been deleted.';
    }

    return error.message || 'An unexpected error occurred while saving the store';
  }

  cancel(): void {
    if (this.hasUnsavedChanges()) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) {
        return;
      }
    }
    this.router.navigate(['/stores']);
  }

  private hasUnsavedChanges(): boolean {
    if (!this.isEditMode) {
      // Safe access with optional chaining and fallbacks
      return (this.store.name?.trim().length ?? 0) > 0 || 
             (this.store.address?.trim().length ?? 0) > 0 || 
             (this.store.contactNumber?.trim().length ?? 0) > 0;
    }

    // Safe comparison with fallbacks
    return this.store.name !== this.originalStoreName ||
           (this.store.address || '') !== this.originalStoreAddress ||
           (this.store.contactNumber || '') !== this.originalContactNumber;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  private isValidPhoneNumber(phone: string): boolean {
    if (!phone) return false; // Handle undefined/null
    
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    const digitsOnly = phone.replace(/[\s\-\(\)\+]/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  toggleStoreStatus(): void {
    this.store.isActive = !this.store.isActive;
  }

  // Safe getters with fallbacks
  get productCount(): number {
    return this.store.productCount ?? 0;
  }

  get purchaseCount(): number {
    return this.store.purchaseCount ?? 0;
  }

  get saleCount(): number {
    return this.store.saleCount ?? 0;
  }

  // Safe method to get store name for display
  get storeName(): string {
    return this.store.name || 'New Store';
  }
}