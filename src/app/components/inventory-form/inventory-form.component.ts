import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { Store } from 'src/app/models/store';
import { Product } from 'src/app/models/product';
import { Inventory } from 'src/app/models/inventory';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html'
})
export class InventoryFormComponent implements OnInit {

  inventoryForm!: FormGroup;
  stores: Store[] = [];
  products: Product[] = [];
  isEditMode: boolean = false;
  inventoryId?: number;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      storeId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      costPrice: ['', [Validators.required, Validators.min(0)]]
    });

    // Load stores and products
    this.storeService.getStores().subscribe(data => this.stores = data);
    this.productService.getProducts().subscribe(data => this.products = data);

    // Check if edit mode
    this.route.params.subscribe(params => {
      this.inventoryId = +params['id'];
      if (this.inventoryId) {
        this.isEditMode = true;
        // loadInventory(this.inventoryId); // Optional: implement if you want edit by ID
      }
    });
  }

  onSubmit() {
    if (this.inventoryForm.invalid) return;

    const { storeId, productId, quantity, costPrice } = this.inventoryForm.value;

    this.inventoryService.createOrUpdateInventory(storeId, productId, quantity, costPrice)
      .subscribe(() => {
        alert(this.isEditMode ? 'Inventory updated successfully' : 'Inventory added successfully');
        this.router.navigate(['/inventories']);
      });
  }

  onCancel() {
    this.router.navigate(['/inventories']);
  }
}
