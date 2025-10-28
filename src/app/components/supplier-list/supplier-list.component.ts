import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm = '';
  loading = false;
  deleting = false;
  deleteSupplierId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        // Only include active suppliers
        this.suppliers = suppliers.filter(s => s.isActive !== false);
        this.filteredSuppliers = [...this.suppliers];
        this.totalItems = this.filteredSuppliers.length;
        this.applyFilters();
        this.loading = false;
        
        console.log('Suppliers loaded:', this.suppliers);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        alert('Error loading suppliers: ' + error.message);
        this.loading = false;
      }
    });
  }

  // ✅ ADD MISSING METHODS
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
    let filtered = this.suppliers;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(term) ||
        (supplier.contactEmail?.toLowerCase().includes(term)) ||
        supplier.phone.toLowerCase().includes(term) ||
        (supplier.address?.toLowerCase().includes(term))
      );
    }

    this.filteredSuppliers = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  get paginatedSuppliers(): Supplier[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredSuppliers.slice(startIndex, startIndex + this.pageSize);
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

  addNewSupplier(): void {
    this.router.navigate(['/suppliers/new']);
  }

  editSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers/edit', supplier.id]);
  }

  viewSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers/view', supplier.id]);
  }

  deleteSupplier(supplier: Supplier): void {
    if (!supplier.id) return;
    
    // ✅ ENHANCED: Check if supplier has products before deletion
    if (this.hasProducts(supplier)) {
      const confirmed = confirm(
        `Warning: Supplier "${supplier.name}" has ${this.getProductCountText(supplier)}.\n\n` +
        `Deleting this supplier will remove all associated products. Are you sure you want to continue?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = confirm(`Are you sure you want to delete supplier "${supplier.name}"?`);
      if (!confirmed) return;
    }

    this.deleting = true;
    this.deleteSupplierId = supplier.id;

    this.supplierService.softDeleteSupplier(supplier.id).subscribe({
      next: () => {
        // Remove supplier from UI list
        this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
        this.applyFilters();
        this.deleting = false;
        this.deleteSupplierId = null;
        
        // Show success message
        alert(`Supplier "${supplier.name}" deleted successfully!`);
      },
      error: (error) => {
        console.error('Error deleting supplier:', error);
        
        // Enhanced error handling
        let errorMessage = 'Error deleting supplier: ' + error.message;
        if (error.message.includes('Cannot delete supplier with existing products')) {
          errorMessage = `Cannot delete "${supplier.name}" because they have ${this.getProductCountText(supplier)}. ` +
                        `Please reassign or delete the products first.`;
        }
        
        alert(errorMessage);
        this.deleting = false;
        this.deleteSupplierId = null;
      }
    });
  }

  // ✅ ENHANCED PRODUCT COUNT METHODS
  getProductCount(supplier: Supplier): number {
    // Use productCount from API if available, otherwise count products array
    return supplier.productCount || (supplier.products ? supplier.products.length : 0);
  }

  hasProducts(supplier: Supplier): boolean {
    return this.getProductCount(supplier) > 0;
  }

  getProductCountText(supplier: Supplier): string {
    const count = this.getProductCount(supplier);
    return count === 1 ? '1 product' : `${count} products`;
  }

  // ✅ REFRESH METHOD
  refreshSuppliers(): void {
    this.loadSuppliers();
  }

  // ✅ GET SUPPLIER STATUS
  getSupplierStatus(supplier: Supplier): { class: string, text: string } {
    if (supplier.isActive === false) {
      return { class: 'text-danger', text: 'Inactive' };
    }
    return { class: 'text-success', text: 'Active' };
  }

  // ✅ GET DISPLAY INFO WITH FALLBACKS
  getDisplayEmail(supplier: Supplier): string {
    return supplier.contactEmail || 'No email';
  }

  getDisplayAddress(supplier: Supplier): string {
    return supplier.address || 'No address';
  }

  // ✅ FORMAT PHONE NUMBER (optional)
  formatPhone(phone: string): string {
    // Simple formatting - you can enhance this
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
}