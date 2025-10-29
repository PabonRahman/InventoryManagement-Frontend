import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Supplier } from '../../models/supplier';
import { Store } from '../../models/store';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  // ✅ SIMPLIFIED PRODUCT OBJECT - Use the corrected interface
  product: Product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    // Only use ID fields - no object fields!
    categoryId: undefined,
    supplierId: undefined,
    storeId: undefined,
    categoryName: undefined,
    supplierName: undefined,
    storeName: undefined,
    category: undefined
  };

  categories: Category[] = [];
  suppliers: Supplier[] = [];
  stores: Store[] = [];
  isEditMode = false;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();
    this.loadStores();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProduct(Number(id));
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories,
      error: e => this.showError('Error loading categories: ' + e.message)
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: suppliers => this.suppliers = suppliers,
      error: e => this.showError('Error loading suppliers: ' + e.message)
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: stores => this.stores = stores,
      error: e => this.showError('Error loading stores: ' + e.message)
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: product => { 
        console.log('📦 Loaded product:', product);
        // ✅ SIMPLIFIED - Just assign the product directly
        this.product = product;
        this.loading = false; 
        
        // Set image preview if imageUrl exists
        if (this.product.imageUrl) {
          this.imagePreview = this.getFullImageUrl(this.product.imageUrl);
        }
      },
      error: e => { 
        this.showError('Error loading product: ' + e.message); 
        this.loading = false;
        this.router.navigate(['/products']); 
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) { 
      this.showError('Please select an image file (JPEG, PNG, GIF)'); 
      return; 
    }
    
    if (file.size > 5 * 1024 * 1024) { 
      this.showError('File size must be less than 5MB'); 
      return; 
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.product.imageUrl = '';
    // Reset file input
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  saveProduct(): void {
    // Validation
    if (!this.validateForm()) return;

    this.loading = true;

    console.log('💾 Saving product:', this.product);
    console.log('🎯 Category ID:', this.product.categoryId);
    console.log('🏪 Supplier ID:', this.product.supplierId);
    console.log('🛒 Store ID:', this.product.storeId);

    // ✅ USE SIMPLE UPDATE FOR CATEGORY ASSIGNMENTS
    if (this.isEditMode && this.product.id) {
      this.productService.updateProductSimple(this.product.id, this.product).subscribe({
        next: (savedProduct) => { 
          console.log('✅ Product saved successfully:', savedProduct);
          console.log('✅ Category ID after save:', savedProduct.categoryId);
          this.loading = false; 
          this.showSuccess('Product updated successfully!');
          this.router.navigate(['/products']); 
        },
        error: e => { 
          console.error('❌ Error saving product:', e);
          this.loading = false; 
          this.handleSaveError(e); 
        }
      });
    } else {
      // For new products, use create with file if needed
      this.productService.createProduct(this.product, this.selectedFile!).subscribe({
        next: () => { 
          this.loading = false; 
          this.showSuccess('Product created successfully!');
          this.router.navigate(['/products']); 
        },
        error: e => { 
          this.loading = false; 
          this.handleSaveError(e); 
        }
      });
    }
  }

  private validateForm(): boolean {
    const errors: string[] = [];

    if (!this.product.name?.trim()) { 
      errors.push('Product name is required');
    }
    
    if (!this.product.price || this.product.price <= 0) { 
      errors.push('Valid price is required (must be greater than 0)');
    }
    
    if (this.product.quantity === undefined || this.product.quantity < 0) { 
      errors.push('Valid quantity is required (must be 0 or greater)');
    }
    
    if (!this.product.categoryId) { 
      errors.push('Please select a category');
    }
    
    if (!this.product.supplierId) { 
      errors.push('Please select a supplier');
    }
    
    if (!this.product.storeId) { 
      errors.push('Please select a store');
    }

    if (errors.length > 0) {
      this.showError(errors.join('\n• '));
      return false;
    }

    return true;
  }

  private handleSaveError(error: any): void {
    let userMessage = 'Error saving product: ' + error.message;
    
    // Handle specific error cases
    if (error.message.includes('File too large')) {
      userMessage = 'Image file is too large. Please select a file smaller than 5MB.';
    } else if (error.message.includes('Unsupported file type')) {
      userMessage = 'Unsupported file type. Please use JPEG, PNG, or GIF images.';
    } else if (error.message.includes('Internal server error')) {
      userMessage = 'Server error occurred. Please try again later.';
    }

    this.showError(userMessage);
  }

  private showSuccess(message: string): void {
    alert('✅ ' + message);
  }

  private showError(message: string): void {
    alert('❌ ' + message);
  }

  private getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8080${imageUrl}`;
  }

  cancel(): void { 
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/products']); 
    }
  }

  // ✅ SIMPLIFIED COMPARISON FUNCTIONS
  compareById(o1: any, o2: any): boolean {
    if (!o1 || !o2) return false;
    const id1 = typeof o1 === 'object' ? o1.id : o1;
    const id2 = typeof o2 === 'object' ? o2.id : o2;
    return id1 === id2;
  }
}