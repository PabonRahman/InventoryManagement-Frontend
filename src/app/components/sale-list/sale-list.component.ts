import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaleResponse } from '../../models/sale-response';
import { Product } from '../../models/product';
import { Store } from '../../models/store';
import { SaleService } from '../../services/sale.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {
  sales: SaleResponse[] = [];
  filteredSales: SaleResponse[] = [];
  products: Product[] = [];
  stores: Store[] = [];

  searchTerm: string = '';
  selectedProduct: string = 'all';
  selectedStore: string = 'all';
  dateRange: { start: string; end: string } = { start: '', end: '' };

  loading = false;
  deleting = false;
  deleteSaleId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  // Load initial sales, products, stores
  loadInitialData(): void {
    this.loading = true;

    Promise.all([
      this.saleService.getSales().toPromise(),
      this.productService.getProducts().toPromise(),
      this.storeService.getStores().toPromise()
    ])
      .then(([sales, products, stores]) => {
        this.sales = sales || [];
        this.filteredSales = [...this.sales];
        this.products = products || [];
        this.stores = stores || [];
        this.totalItems = this.sales.length;
        this.applyFilters();
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading initial data:', error);
        this.showError('Error loading sales data: ' + error.message);
        this.loading = false;
      });
  }

  // Filters
  applyFilters(): void {
    let filtered = this.sales;

    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.product?.name?.toLowerCase().includes(term) ||
        sale.store?.name?.toLowerCase().includes(term) ||
        (sale.description && sale.description.toLowerCase().includes(term)) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(term))
      );
    }

    // Product filter
    if (this.selectedProduct !== 'all') {
      filtered = filtered.filter(sale => sale.product?.id === Number(this.selectedProduct));
    }

    // Store filter
    if (this.selectedStore !== 'all') {
      filtered = filtered.filter(sale => sale.store?.id === Number(this.selectedStore));
    }

    // Date range filter
    if (this.dateRange.start) {
      const start = new Date(this.dateRange.start);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(sale => new Date(sale.saleDate) >= start);
    }
    if (this.dateRange.end) {
      const end = new Date(this.dateRange.end);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(sale => new Date(sale.saleDate) <= end);
    }

    this.filteredSales = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedProduct = 'all';
    this.selectedStore = 'all';
    this.dateRange = { start: '', end: '' };
    this.applyFilters();
  }

  onSearchChange() { this.applyFilters(); }
  onFilterChange() { this.applyFilters(); }
  onDateRangeChange() { this.applyFilters(); }

  setDateRange(range: string) {
    const today = new Date();
    switch (range) {
      case 'today':
        this.dateRange.start = this.dateRange.end = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        this.dateRange.start = weekStart.toISOString().split('T')[0];
        this.dateRange.end = today.toISOString().split('T')[0];
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        this.dateRange.start = monthStart.toISOString().split('T')[0];
        this.dateRange.end = today.toISOString().split('T')[0];
        break;
    }
    this.applyFilters();
  }

  // Pagination
  get paginatedSales(): SaleResponse[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredSales.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  // CRUD
  addNewSale() { this.router.navigate(['/sales/new']); }
  editSale(sale: SaleResponse) { if (sale.id) this.router.navigate(['/sales/edit', sale.id]); }
  viewSale(sale: SaleResponse) { if (sale.id) this.router.navigate(['/sales/view', sale.id]); }

  deleteSale(sale: SaleResponse): void {
    if (!sale.id) return;
    if (!confirm(`Delete sale of "${sale.product?.name}"?`)) return;

    this.deleting = true;
    this.deleteSaleId = sale.id;
    this.saleService.deleteSale(sale.id).subscribe({
      next: () => {
        this.sales = this.sales.filter(s => s.id !== sale.id);
        this.applyFilters();
        this.deleting = false;
        this.deleteSaleId = null;
        this.showSuccess('Sale deleted successfully!');
      },
      error: error => {
        console.error('Error deleting sale:', error);
        this.deleting = false;
        this.deleteSaleId = null;
        this.showError('Error deleting sale: ' + error.message);
      }
    });
  }

  // Helpers
  calculateTotal(sale: SaleResponse): number {
    return (sale.quantity || 0) * (sale.price || 0);
  }

  getTotalRevenue(): number {
    return this.filteredSales.reduce((sum, sale) => sum + this.calculateTotal(sale), 0);
  }

  getTotalUnitsSold(): number {
    return this.filteredSales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getTime(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  getDescriptionPreview(description: string): string {
    return description.length > 30 ? description.substr(0, 30) + '...' : description;
  }

  showSuccess(message: string) { alert('✅ ' + message); }
  showError(message: string) { alert('❌ ' + message); }
}
