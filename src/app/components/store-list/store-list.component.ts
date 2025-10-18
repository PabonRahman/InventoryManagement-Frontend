import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html'
})
export class StoreListComponent implements OnInit {

  stores: Store[] = [];

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores() {
    this.storeService.getStores().subscribe(data => this.stores = data);
  }

  deleteStore(id: number) {
    if(confirm("Are you sure to delete this store?")) {
      this.storeService.deleteStore(id).subscribe(() => this.loadStores());
    }
  }
}
