import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Purchase } from '../../models/purchase';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  loading = false;

  constructor(private purchaseService: PurchaseService, private router: Router) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    this.purchaseService.getPurchases().subscribe(
      res => {
        this.purchases = res;
        this.loading = false;
      },
      err => {
        console.error('Error loading purchases:', err);
        this.loading = false;
      }
    );
  }

  editPurchase(id: number): void {
    this.router.navigate(['/purchases/edit', id]);
  }

  deletePurchase(id: number): void {
    if (confirm('Are you sure you want to delete this purchase?')) {
      this.purchaseService.deletePurchase(id).subscribe(
        () => this.loadPurchases(),
        err => console.error('Error deleting purchase:', err)
      );
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}
