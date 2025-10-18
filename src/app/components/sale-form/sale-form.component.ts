import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sale } from '../../models/sale';
import { Product } from '../../models/product';
import { SaleService } from '../../services/sale.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.css']
})
export class SaleFormComponent implements OnInit {
  sale: Sale = {
    product: {} as Product,
    quantity: 1,
    price: 0,
    saleDate: new Date()
  };

  products: Product[] = [];
  isEditMode = false;
  loading = false;

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSale(Number(id));
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      products => this.products = products,
      error => console.error('Error loading products', error)
    );
  }

  loadSale(id: number): void {
    this.loading = true;
    this.saleService.getSale(id).subscribe(
      sale => {
        this.sale = sale;
        this.loading = false;
      },
      error => {
        console.error('Error loading sale', error);
        this.router.navigate(['/sales']);
      }
    );
  }

  saveSale(): void {
    if (!this.sale.product.id || !this.sale.quantity || !this.sale.price || !this.sale.saleDate) {
      alert('Please fill in all required fields.');
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.saleService.updateSale(this.sale.id!, this.sale).subscribe(
        () => this.router.navigate(['/sales']),
        error => {
          console.error('Error updating sale', error);
          alert('Error updating sale: ' + error.message);
          this.loading = false;
        }
      );
    } else {
      this.saleService.createSale(this.sale).subscribe(
        () => this.router.navigate(['/sales']),
        error => {
          console.error('Error creating sale', error);
          alert('Error creating sale: ' + error.message);
          this.loading = false;
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/sales']);
  }
}
