import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Purchase } from '../../models/purchase';
import { PurchaseDTO } from 'src/app/models/PurchaseDTO';
import { PurchaseRequest } from '../../models/purchase-request';
import { Product } from '../../models/product';
import { Supplier } from '../../models/supplier';
import { Store } from '../../models/store';
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { SupplierService } from '../../services/supplier.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {

  purchase: Purchase = {
    product: {} as Product,
    supplier: {} as Supplier,
    store: {} as Store,
    quantity: 1,
    price: 0,
    purchaseDate: new Date(),
    description: ''
  };

  products: Product[] = [];
  suppliers: Supplier[] = [];
  stores: Store[] = [];
  isEditMode = false;
  loading = false;
  errorMessage = '';

  constructor(
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;

    // Load all dropdowns first
    forkJoin({
      products: this.productService.getProducts(),
      suppliers: this.supplierService.getSuppliers(),
      stores: this.storeService.getStores()
    }).subscribe({
      next: ({ products, suppliers, stores }) => {
        this.products = products;
        this.suppliers = suppliers;
        this.stores = stores;

        if (this.isEditMode && id) {
          this.loadPurchase(Number(id));
        } else {
          // Preselect first options for new purchase
          if (products.length) this.purchase.product = products[0];
          if (suppliers.length) this.purchase.supplier = suppliers[0];
          if (stores.length) this.purchase.store = stores[0];
        }
      },
      error: (error) => {
        console.error('Error loading dropdowns:', error);
        this.errorMessage = 'Error loading dropdown data: ' + error.message;
      }
    });
  }

  // Map flat DTO into nested Purchase
  private mapDTOtoPurchase(dto: PurchaseDTO): Purchase {
    const product = this.products.find(p => p.id === dto.productId) || { id: dto.productId, name: dto.productName } as Product;
    const supplier = this.suppliers.find(s => s.id === dto.supplierId) || { id: dto.supplierId, name: dto.supplierName } as Supplier;
    const store = this.stores.find(st => st.id === dto.storeId) || { id: dto.storeId, name: dto.storeName } as Store;

    return {
      id: dto.id,
      product,
      supplier,
      store,
      quantity: dto.quantity,
      price: dto.price,
      purchaseDate: typeof dto.purchaseDate === 'string' ? new Date(dto.purchaseDate) : dto.purchaseDate,
      description: dto.description
    };
  }

  private loadPurchase(id: number): void {
    this.loading = true;
    this.purchaseService.getPurchase(id).subscribe({
      next: (dto: PurchaseDTO) => {
        this.purchase = this.mapDTOtoPurchase(dto);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading purchase:', error);
        this.errorMessage = 'Error loading purchase: ' + error.message;
        this.loading = false;
      }
    });
  }

  calculateTotal(): number {
    return this.purchase.quantity * this.purchase.price;
  }

  savePurchase(): void {
    // Validation
    if (!this.purchase.product?.id) { this.errorMessage = 'Please select a product'; return; }
    if (!this.purchase.supplier?.id) { this.errorMessage = 'Please select a supplier'; return; }
    if (!this.purchase.store?.id) { this.errorMessage = 'Please select a store'; return; }
    if (!this.purchase.quantity || this.purchase.quantity <= 0) { this.errorMessage = 'Please enter a valid quantity'; return; }
    if (!this.purchase.price || this.purchase.price < 0) { this.errorMessage = 'Please enter a valid price'; return; }
    if (!this.purchase.purchaseDate) { this.errorMessage = 'Please select a purchase date'; return; }

    this.loading = true;
    this.errorMessage = '';

    const purchaseRequest: PurchaseRequest = {
      productId: this.purchase.product.id!,
      supplierId: this.purchase.supplier.id!,
      storeId: this.purchase.store.id!,
      quantity: this.purchase.quantity,
      price: this.purchase.price,
      purchaseDate: this.purchase.purchaseDate instanceof Date
        ? this.purchase.purchaseDate.toISOString().substring(0, 10)
        : this.purchase.purchaseDate,
      description: this.purchase.description
    };

    const saveOperation = this.isEditMode
      ? this.purchaseService.updatePurchase(this.purchase.id!, purchaseRequest)
      : this.purchaseService.createPurchase(purchaseRequest);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/purchases']);
      },
      error: (error) => {
        console.error('Error saving purchase:', error);
        this.errorMessage = error.message || 'Error saving purchase';
        this.loading = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/purchases']); }
  clearError(): void { this.errorMessage = ''; }

  // Dropdown comparison helpers
  compareProduct(p1: Product, p2: Product): boolean { return p1 && p2 ? p1.id === p2.id : p1 === p2; }
  compareSupplier(s1: Supplier, s2: Supplier): boolean { return s1 && s2 ? s1.id === s2.id : s1 === s2; }
  compareStore(s1: Store, s2: Store): boolean { return s1 && s2 ? s1.id === s2.id : s1 === s2; }
}
