import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Supplier } from '../../models/supplier';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = { 
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: {} as Category,
    supplier: undefined
  };
  
  categories: Category[] = [];
  suppliers: Supplier[] = [];
  isEditMode = false;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProduct(Number(id));
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      if (!this.product.category.id && categories.length > 0) {
        this.product.category = categories[0];
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe(
      product => {
        this.product = product;
        this.loading = false;
      },
      error => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.product.imageUrl = '';
  }

  saveProduct(): void {
    if (!this.product.name || !this.product.price || !this.product.quantity) {
      alert('Please fill in all required fields');
      return;
    }
    if (!this.product.category?.id) {
      alert('Please select a category');
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id!, this.product, this.selectedFile!).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error => {
          console.error('Error updating product:', error);
          alert('Error updating product: ' + error.message);
          this.loading = false;
        }
      );
    } else {
      this.productService.createProduct(this.product, this.selectedFile!).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error => {
          console.error('Error creating product:', error);
          alert('Error creating product: ' + error.message);
          this.loading = false;
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
