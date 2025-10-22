import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { Store } from 'src/app/models/store';
import { Product } from 'src/app/models/product';
import { TransactionType } from 'src/app/models/transaction-type';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent implements OnInit {

  transactionForm!: FormGroup;
  stores: Store[] = [];
  products: Product[] = [];
  transactionTypes = Object.values(TransactionType);

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      storeId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      description: ['']
    });

    this.storeService.getStores().subscribe(data => this.stores = data);
    this.productService.getProducts().subscribe(data => this.products = data);
  }


  onSubmit() {
  if (this.transactionForm.invalid) return;

  const { storeId, productId, quantity, price, type, description } = this.transactionForm.value;

  this.transactionService.createTransaction(storeId, productId, quantity, price, type, description)
    .subscribe({
      next: () => {
        alert('Transaction created successfully');
        this.router.navigate(['/transactions']);
      },
      error: (err) => {
        console.error('Error:', err);

        // Try to extract readable message from backend response
        let errorMessage = 'Something went wrong! Please try again.';

        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.error) {
            // From your backend GlobalExceptionHandler: { error: "Inventory not found..." }
            errorMessage = err.error.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }

        alert(errorMessage);
      }
    });
}

  // onSubmit() {
  //   if (this.transactionForm.invalid) return;

  //   const { storeId, productId, quantity, price, type, description } = this.transactionForm.value;

  //   this.transactionService.createTransaction(storeId, productId, quantity, price, type, description)
  //     .subscribe(() => {
  //       alert('Transaction created successfully');
  //       this.router.navigate(['/transactions']);
  //     });
  // }

  onCancel() {
    this.router.navigate(['/transactions']);
  }
}
