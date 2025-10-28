import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../../models/store';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  
  // Search and filter properties
  searchTerm: string = '';
  statusFilter: string = 'all'; // 'all', 'active', 'inactive'
  
  // Loading states
  loading = false;
  deleting = false;
  deleteStoreId: number | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 8;
  totalItems = 0;

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.loading = true;
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.filteredStores = [...stores];
        this.totalItems = stores.length;
        this.applyFilters();
        this.loading = false;
        console.log('Stores loaded with counts:', stores);
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        alert('Error loading stores: ' + error.message);
        this.loading = false;
      }
    });
  }

  // Search and filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.stores;

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(term) ||
        (store.address && store.address.toLowerCase().includes(term)) ||
        (store.contactNumber && store.contactNumber.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(store => store.isActive === isActive);
    }

    this.filteredStores = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1; // Reset to first page when filters change
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  // Pagination methods
  get paginatedStores(): Store[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredStores.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // CRUD operations
  editStore(store: Store): void {
    this.router.navigate(['/stores/edit', store.id]);
  }

  viewStore(store: Store): void {
    this.router.navigate(['/stores/view', store.id]);
  }

  deleteStore(store: Store): void {
    if (!store.id) return;

    const confirmed = confirm(`Are you sure you want to delete the store "${store.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    this.deleting = true;
    this.deleteStoreId = store.id;

    this.storeService.deleteStore(store.id).subscribe({
      next: () => {
        this.stores = this.stores.filter(s => s.id !== store.id);
        this.applyFilters();
        this.deleting = false;
        this.deleteStoreId = null;
      },
      error: (error) => {
        console.error('Error deleting store:', error);
        alert('Error deleting store: ' + error.message);
        this.deleting = false;
        this.deleteStoreId = null;
      }
    });
  }

  addNewStore(): void {
    this.router.navigate(['/stores/new']);
  }

  // Helper methods
  getStoreStats(store: Store): { products: number, purchases: number, sales: number } {
    // Use the count fields from the API response
    return {
      products: store.productCount || 0,
      purchases: store.purchaseCount || 0,
      sales: store.saleCount || 0
    };
  }

  getAddressPreview(address?: string): string {
    if (!address) return 'No address provided';
    return address.length > 80 ? address.substring(0, 80) + '...' : address;
  }

  toggleStoreStatus(store: Store): void {
    if (!store.id) return;

    const newStatus = !store.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    const confirmed = confirm(`Are you sure you want to ${action} the store "${store.name}"?`);
    if (!confirmed) return;

    const updatedStore: Store = { 
      ...store, 
      isActive: newStatus 
    };
    
    this.storeService.updateStore(store.id, updatedStore).subscribe({
      next: () => {
        store.isActive = newStatus;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating store status:', error);
        alert('Error updating store status: ' + error.message);
        // Revert the change in UI if API call fails
        store.isActive = !newStatus;
      }
    });
  }

  // Get badge class based on status
  getStatusBadgeClass(store: Store): string {
    return store.isActive ? 'badge bg-success' : 'badge bg-secondary';
  }

  getStatusText(store: Store): string {
    return store.isActive ? 'Active' : 'Inactive';
  }

  // Check if store has any data (products, purchases, or sales)
  hasStoreData(store: Store): boolean {
    return (store.productCount || 0) > 0 || 
           (store.purchaseCount || 0) > 0 || 
           (store.saleCount || 0) > 0;
  }

  // Get total statistics for all stores
  getTotalStats(): { totalStores: number, activeStores: number, totalProducts: number } {
    const totalStores = this.stores.length;
    const activeStores = this.stores.filter(store => store.isActive).length;
    const totalProducts = this.stores.reduce((sum, store) => sum + (store.productCount || 0), 0);
    
    return {
      totalStores,
      activeStores,
      totalProducts
    };
  }
}