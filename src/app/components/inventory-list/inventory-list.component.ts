import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../models/inventory';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent implements OnInit {

  inventories: Inventory[] = [];

  constructor(private inventoryService: InventoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories() {
    this.inventoryService.getInventories().subscribe(data => this.inventories = data);
  }

  deleteInventory(id: number) {
    if(confirm('Are you sure to delete this inventory?')) {
      this.inventoryService.deleteInventory(id).subscribe(() => this.loadInventories());
    }
  }

  editInventory(id: number) {
    this.router.navigate(['/inventories/edit', id]);
  }
}
