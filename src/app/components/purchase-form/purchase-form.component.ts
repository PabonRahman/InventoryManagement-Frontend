import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Purchase } from '../../models/purchase';
import { Product } from '../../models/product';
import { Supplier } from '../../models/supplier';
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {
  purchase: Purchase = {
    product: {} as Product,
    supplier: {} as Supplier,
    quantity: 0,
    price: 0,
    purchaseDate: new Date()
  };
  products: Product[] = [];
  suppliers: Supplier[] = [];
  isEditMode = false;
  loading = false;

  constructor(
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadPurchase(Number(id));
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(res => this.products = res);
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(res => this.suppliers = res);
  }

  loadPurchase(id: number): void {
    this.loading = true;
    this.purchaseService.getPurchase(id).subscribe(
      res => {
        this.purchase = res;
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.router.navigate(['/purchases']);
      }
    );
  }

  savePurchase(): void {
    if (this.isEditMode) {
      this.purchaseService.updatePurchase(this.purchase.id!, this.purchase).subscribe(
        () => this.router.navigate(['/purchases']),
        err => console.error(err)
      );
    } else {
      this.purchaseService.createPurchase(this.purchase).subscribe(
        () => this.router.navigate(['/purchases']),
        err => console.error(err)
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/purchases']);
  }
}
