import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
Number(arg0: string): number|undefined {
throw new Error('Method not implemented.');
}
getQuantityClass(arg0: number) {
throw new Error('Method not implemented.');
}
  products: Product[] = [];
  filteredProducts: Product[] = [];

  categories: any[] = [];
  suppliers: any[] = [];
  stores: any[] = [];

  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedSupplier: string = 'all';
  selectedStore: string = 'all';

  loading = false;
  deleting = false;
  deleteProductId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;

    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getCategories(),
      suppliers: this.supplierService.getSuppliers(),
      stores: this.storeService.getStores()
    }).subscribe({
      next: (results) => {
        console.log('📦 Loaded products:', results.products);
        console.log('🏷️ Loaded categories:', results.categories);
        
        this.categories = results.categories;
        this.suppliers = results.suppliers;
        this.stores = results.stores;

        // Map names to products to prevent undefined errors
        this.products = results.products.map(p => ({
          ...p,
          categoryName: this.getCategoryName(p.categoryId),
          supplierName: this.getSupplierName(p.supplierId),
          storeName: this.getStoreName(p.storeId)
        }));

        this.filteredProducts = [...this.products];
        this.totalItems = this.products.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        alert('Error loading data: ' + error.message);
        this.loading = false;
      }
    });
  }

  // ✅ ADD THESE MISSING METHODS:
  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name?.toLowerCase().includes(term)) ||
        (p.description?.toLowerCase().includes(term)) ||
        (p.categoryName?.toLowerCase().includes(term)) ||
        (p.supplierName?.toLowerCase().includes(term)) ||
        (p.storeName?.toLowerCase().includes(term))
      );
    }

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === Number(this.selectedCategory));
    }

    if (this.selectedSupplier !== 'all') {
      filtered = filtered.filter(p => p.supplierId === Number(this.selectedSupplier));
    }

    if (this.selectedStore !== 'all') {
      filtered = filtered.filter(p => p.storeId === Number(this.selectedStore));
    }

    this.filteredProducts = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedSupplier = 'all';
    this.selectedStore = 'all';
    this.applyFilters();
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  addNewProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(product: Product): void {
    if (product.id) this.router.navigate(['/products/edit', product.id]);
  }

  viewProduct(product: Product): void {
    if (product.id) this.router.navigate(['/products/view', product.id]);
  }

  deleteProduct(product: Product): void {
    if (!product.id) return;

    const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmed) return;

    this.deleting = true;
    this.deleteProductId = product.id;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.applyFilters();
        this.deleting = false;
        this.deleteProductId = null;
        alert(`Product "${product.name}" deleted successfully.`);
      },
      error: (error) => {
        this.deleting = false;
        this.deleteProductId = null;
        alert(`Error deleting product: ${error.message}`);
      }
    });
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'No Category';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  getSupplierName(supplierId?: number): string {
    if (!supplierId) return 'No Supplier';
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  }

  getStoreName(storeId?: number): string {
    if (!storeId) return 'No Store';
    const store = this.stores.find(s => s.id === storeId);
    return store?.name || 'Unknown Store';
  }

  getStockStatus(product: Product): { class: string; text: string } {
    const qty = product.quantity || 0;
    if (qty === 0) return { class: 'text-danger', text: 'Out of Stock' };
    if (qty < 10) return { class: 'text-warning', text: 'Low Stock' };
    return { class: 'text-success', text: 'In Stock' };
  }

  getImageUrl(product: Product): string {
    const baseUrl = 'http://localhost:8080';
    if (product.imageUrl) {
      return product.imageUrl.startsWith('http') ? product.imageUrl : `${baseUrl}${product.imageUrl}`;
    }
    return 'assets/images/placeholder-product.png';
  }

  // ✅ ADDED: Refresh products (useful after edits)
  refreshProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.map(p => ({
          ...p,
          categoryName: this.getCategoryName(p.categoryId),
          supplierName: this.getSupplierName(p.supplierId),
          storeName: this.getStoreName(p.storeId)
        }));
        this.filteredProducts = [...this.products];
        this.totalItems = this.products.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error refreshing products:', error);
        this.loading = false;
      }
    });
  }
}