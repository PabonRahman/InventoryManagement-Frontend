import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseDTO } from 'src/app/models/PurchaseDTO';
import { Product } from '../../models/product';
import { Supplier } from '../../models/supplier';
import { Store } from '../../models/store';
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { SupplierService } from '../../services/supplier.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {
  purchases: PurchaseDTO[] = [];
  filteredPurchases: PurchaseDTO[] = [];
  products: Product[] = [];
  suppliers: Supplier[] = [];
  stores: Store[] = [];

  searchTerm: string = '';
  selectedProduct: string = 'all';
  selectedSupplier: string = 'all';
  selectedStore: string = 'all';
  dateRange: { start: string; end: string } = { start: '', end: '' };

  loading = false;
  deleting = false;
  deletePurchaseId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers();
    this.loadStores();
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    this.purchaseService.getPurchases().subscribe({
      next: (purchases) => {
        this.purchases = purchases || [];
        this.filteredPurchases = this.purchases.slice();
        this.totalItems = this.purchases.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
        alert('Error loading purchases: ' + (error?.message || error));
        this.purchases = [];
        this.filteredPurchases = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => this.products = products || [],
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers = suppliers || [],
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (stores) => this.stores = stores || [],
      error: (error) => console.error('Error loading stores:', error)
    });
  }

  applyFilters(): void {
    let filtered = this.purchases;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.productName?.toLowerCase().includes(term)) ||
        (p.supplierName?.toLowerCase().includes(term)) ||
        (p.storeName?.toLowerCase().includes(term)) ||
        (p.description?.toLowerCase().includes(term))
      );
    }

    if (this.selectedProduct !== 'all') {
      filtered = filtered.filter(p => p.productId === Number(this.selectedProduct));
    }

    if (this.selectedSupplier !== 'all') {
      filtered = filtered.filter(p => p.supplierId === Number(this.selectedSupplier));
    }

    if (this.selectedStore !== 'all') {
      filtered = filtered.filter(p => p.storeId === Number(this.selectedStore));
    }

    if (this.dateRange.start) {
      const startDate = new Date(this.dateRange.start);
      filtered = filtered.filter(p => new Date(p.purchaseDate) >= startDate);
    }

    if (this.dateRange.end) {
      const endDate = new Date(this.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.purchaseDate) <= endDate);
    }

    this.filteredPurchases = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }
  onDateRangeChange(): void { this.applyFilters(); }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedProduct = 'all';
    this.selectedSupplier = 'all';
    this.selectedStore = 'all';
    this.dateRange = { start: '', end: '' };
    this.applyFilters();
  }

  get paginatedPurchases(): PurchaseDTO[] {
    if (!this.filteredPurchases) return [];
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPurchases.slice(startIndex, startIndex + this.pageSize);
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

  editPurchase(purchase: PurchaseDTO): void {
    this.router.navigate(['/purchases/edit', purchase.id]);
  }

  viewPurchase(purchase: PurchaseDTO): void {
    this.router.navigate(['/purchases/view', purchase.id]);
  }

  deletePurchase(purchase: PurchaseDTO): void {
    if (!purchase.id) return;
    if (!confirm(`Delete purchase of ${purchase.productName}?`)) return;

    this.deleting = true;
    this.deletePurchaseId = purchase.id;

    this.purchaseService.deletePurchase(purchase.id).subscribe({
      next: () => {
        this.purchases = this.purchases.filter(p => p.id !== purchase.id);
        this.applyFilters();
        this.deleting = false;
        this.deletePurchaseId = null;
      },
      error: (error) => {
        console.error('Error deleting purchase:', error);
        alert('Error deleting purchase: ' + (error?.message || error));
        this.deleting = false;
        this.deletePurchaseId = null;
      }
    });
  }

  addNewPurchase(): void {
    this.router.navigate(['/purchases/new']);
  }

  calculateTotal(p: PurchaseDTO): number {
    return (p.quantity || 0) * (p.price || 0);
  }

  getTotalCost(): number {
    return this.filteredPurchases.reduce((sum, p) => sum + this.calculateTotal(p), 0);
  }

  getTotalUnits(): number {
    return this.filteredPurchases.reduce((sum, p) => sum + (p.quantity || 0), 0);
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getDescriptionPreview(description?: string): string {
    if (!description) return '-';
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
  }

  setDateRange(range: 'today' | 'week' | 'month' | 'year'): void {
    const today = new Date();
    let startDate = new Date(today);

    switch (range) {
      case 'week': startDate.setDate(today.getDate() - 7); break;
      case 'month': startDate.setMonth(today.getMonth() - 1); break;
      case 'year': startDate.setFullYear(today.getFullYear() - 1); break;
    }

    this.dateRange = {
      start: startDate.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };

    this.applyFilters();
  }
}
