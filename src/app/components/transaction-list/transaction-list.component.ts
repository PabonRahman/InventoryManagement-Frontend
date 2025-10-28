import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from 'src/app/models/transaction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent implements OnInit {

  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService, private router: Router) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe(data => this.transactions = data);
  }

  deleteTransaction(id: number) {
    if(confirm('Are you sure to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => this.loadTransactions());
    }
  }
}
