import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleResponse } from 'src/app/models/sale-response';
import { Product } from '../../models/product';
import { Store } from '../../models/store';
import { SaleService } from '../../services/sale.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { SaleDTO } from 'src/app/models/sale-dto';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.css']
})
export class SaleFormComponent implements OnInit {
  sale: SaleResponse = {
    product: {} as Product,
    store: {} as Store,
    quantity: 1,
    price: 0,
    saleDate: new Date().toISOString().split('T')[0], // ISO date string
    description: '',
    customerName: undefined,
    id: 0,
    productName: '',
    storeName: ''
  };

  products: Product[] = [];
  stores: Store[] = [];
  isEditMode = false;
  loading = false;
  errorMessage = '';

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadStores();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSale(Number(id));
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        if (!this.sale.product.id && products.length > 0) {
          this.sale.product = products[0];
          this.onProductChange();
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Error loading products: ' + error.message;
      }
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        if (!this.sale.store.id && stores.length > 0) {
          this.sale.store = stores[0];
        }
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.errorMessage = 'Error loading stores: ' + error.message;
      }
    });
  }

  loadSale(id: number): void {
    this.loading = true;
    this.saleService.getSale(id).subscribe({
      next: (sale) => {
        this.sale = sale;
        // Keep saleDate as ISO string
        if (sale.saleDate) {
          this.sale.saleDate = new Date(sale.saleDate).toISOString().split('T')[0];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sale:', error);
        this.errorMessage = 'Error loading sale: ' + error.message;
        this.loading = false;
      }
    });
  }

  onProductChange(): void {
    if (this.sale.product && this.sale.product.price) {
      this.sale.price = this.sale.product.price;
    }
  }

  calculateTotal(): number {
    return (this.sale.quantity || 0) * (this.sale.price || 0);
  }

  saveSale(): void {
    this.errorMessage = '';

    // Validation
    if (!this.sale.product?.id) { this.errorMessage = 'Please select a product'; return; }
    if (!this.sale.store?.id) { this.errorMessage = 'Please select a store'; return; }
    if (!this.sale.quantity || this.sale.quantity <= 0) { this.errorMessage = 'Please enter a valid quantity'; return; }
    if (!this.sale.price || this.sale.price < 0) { this.errorMessage = 'Please enter a valid price'; return; }
    if (!this.sale.saleDate) { this.errorMessage = 'Please select a sale date'; return; }

    // Check stock
    if (this.sale.product.quantity < this.sale.quantity) {
      this.errorMessage = `Insufficient stock. Only ${this.sale.product.quantity} units available.`;
      return;
    }

    this.loading = true;

    // Map to DTO
    const saleDTO: SaleDTO = {
      productId: this.sale.product.id,
      storeId: this.sale.store.id,
      quantity: this.sale.quantity,
      price: this.sale.price,
      saleDate: this.sale.saleDate, // string, already ISO format
      description: this.sale.description
    };

    const saveOperation = this.isEditMode
      ? this.saleService.updateSale(this.sale.id!, saleDTO)
      : this.saleService.createSale(saleDTO);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/sales']);
      },
      error: (error) => {
        console.error('Error saving sale:', error);
        this.errorMessage = error.message || 'Error saving sale';
        this.loading = false;
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
