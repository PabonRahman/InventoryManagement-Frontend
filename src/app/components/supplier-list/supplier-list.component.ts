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
  loading = false;

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getSuppliers().subscribe(
      (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading suppliers:', error);
        this.loading = false;
      }
    );
  }

  addSupplier(): void {
    this.router.navigate(['/suppliers/new']);
  }

  editSupplier(supplierId: number): void {
    this.router.navigate(['/suppliers/edit', supplierId]);
  }

  deleteSupplier(supplierId: number): void {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    this.supplierService.deleteSupplier(supplierId).subscribe(
      () => {
        this.suppliers = this.suppliers.filter(s => s.id !== supplierId);
      },
      (error) => {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier: ' + error.message);
      }
    );
  }
}
