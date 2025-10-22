import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from '../../models/supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {
  supplier: Supplier = {
    name: '',
    contactEmail: '',
    phone: '',
    address: ''
  };
  
  isEditMode = false;
  loading = false;
  errorMessage = '';

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('🔍 SupplierFormComponent initialized');
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSupplier(Number(id));
    }
  }

  loadSupplier(id: number): void {
    this.loading = true;
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        this.supplier = supplier;
        this.loading = false;
        console.log('✅ Supplier loaded:', supplier);
      },
      error: (error) => {
        console.error('❌ Error loading supplier:', error);
        this.errorMessage = 'Failed to load supplier: ' + error.message;
        this.loading = false;
        this.router.navigate(['/suppliers']);
      }
    });
  }

  saveSupplier(): void {
    console.log('💾 Saving supplier:', this.supplier);
    
    if (!this.supplier.name || this.supplier.name.trim() === '') {
      this.errorMessage = 'Supplier name is required';
      alert('Supplier name is required');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const operation = this.isEditMode && this.supplier.id 
      ? this.supplierService.updateSupplier(this.supplier.id, this.supplier)
      : this.supplierService.createSupplier(this.supplier);

    operation.subscribe({
      next: (response) => {
        console.log('✅ Supplier saved successfully:', response);
        this.loading = false;
        alert(`Supplier ${this.isEditMode ? 'updated' : 'created'} successfully!`);
        this.router.navigate(['/suppliers']);
      },
      error: (error) => {
        console.error('❌ Error saving supplier:', error);
        this.loading = false;
        this.errorMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} supplier`;
        alert('Error: ' + this.errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/suppliers']);
  }
}