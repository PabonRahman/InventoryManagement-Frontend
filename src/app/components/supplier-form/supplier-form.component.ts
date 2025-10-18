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
    contactNumber: '',
    email: '',
    address: ''
  };
  isEditMode = false;
  loading = false;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSupplier(Number(id));
    }
  }

  loadSupplier(id: number): void {
    this.loading = true;
    this.supplierService.getSupplier(id).subscribe(
      (supplier) => {
        this.supplier = supplier;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading supplier:', error);
        alert('Failed to load supplier');
        this.loading = false;
        this.router.navigate(['/suppliers']);
      }
    );
  }

  saveSupplier(): void {
    if (!this.supplier.name) {
      alert('Supplier name is required');
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.supplier.id) {
      this.supplierService.updateSupplier(this.supplier.id, this.supplier).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/suppliers']);
        },
        (error) => {
          console.error('Error updating supplier:', error);
          alert('Failed to update supplier');
          this.loading = false;
        }
      );
    } else {
      this.supplierService.createSupplier(this.supplier).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/suppliers']);
        },
        (error) => {
          console.error('Error creating supplier:', error);
          alert('Failed to create supplier');
          this.loading = false;
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/suppliers']);
  }
}
