import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { SaleDTO } from '../../models/sale-dto';
import { Product } from '../../models/product';
import { Store } from '../../models/store';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.css']
})
export class SaleFormComponent implements OnInit {
  sale: any = {
    product: null,
    store: null,
    quantity: 1,
    price: 0,
    saleDate: new Date().toISOString().split('T')[0],
    description: ''
  };
  selectedProductId?: number;
  selectedStoreId?: number;
  products: Product[] = [];
  stores: Store[] = [];
  loading = false;
  errorMessage = '';
  isEditMode = false;

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(p => this.products = p);
    this.storeService.getStores().subscribe(s => this.stores = s);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.saleService.getSale(+id).subscribe(saleData => {
        this.sale = saleData;
        this.selectedProductId = saleData.product?.id;
        this.selectedStoreId = saleData.store?.id;
      });
    }
  }

  onProductChange(product: Product): void {
    this.selectedProductId = product?.id;
    // Auto-populate price if empty and product has a price
    if (product && (!this.sale.price || this.sale.price === 0)) {
      this.sale.price = product.price;
    }
  }

  onStoreChange(store: Store): void {
    this.selectedStoreId = store?.id;
  }

  calculateTotal(): number {
    const quantity = Number(this.sale.quantity) || 0;
    const price = Number(this.sale.price) || 0;
    return quantity * price;
  }

  saveSale(): void {
    this.clearError();

    if (!this.sale.product?.id) {
      this.errorMessage = 'Please select a product';
      return;
    }
    if (!this.sale.store?.id) {
      this.errorMessage = 'Please select a store';
      return;
    }

    const saleDTO: SaleDTO = {
      productId: this.sale.product.id,
      storeId: this.sale.store.id,
      quantity: this.sale.quantity,
      price: this.sale.price,
      saleDate: this.sale.saleDate,
      description: this.sale.description
    };

    this.loading = true;

    const saveOperation = this.isEditMode
      ? this.saleService.updateSale(this.sale.id, saleDTO)
      : this.saleService.createSale(saleDTO);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Error saving sale';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/sales']);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  compareProduct(p1: Product, p2: Product): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareStore(s1: Store, s2: Store): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }
}