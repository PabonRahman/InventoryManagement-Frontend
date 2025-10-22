import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sale } from '../../models/sale';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {
  sales: Sale[] = [];

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getSales().subscribe(
      data => this.sales = data,
      error => console.error('Error loading sales', error)
    );
  }

  addSale(): void {
    this.router.navigate(['/sales/new']);
  }

  editSale(id: number): void {
    this.router.navigate(['/sales/edit', id]);
  }

  deleteSale(id: number): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.saleService.deleteSale(id).subscribe(
        () => this.loadSales(),
        error => console.error('Error deleting sale', error)
      );
    }
  }
}
