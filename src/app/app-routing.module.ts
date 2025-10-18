import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Products
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

// Categories
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

// Suppliers
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';

// Purchases
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseFormComponent } from './components/purchase-form/purchase-form.component';

// Sales
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';

// Stores
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreFormComponent } from './components/store-form/store-form.component';

// Inventories
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';

// Transactions
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // Products
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent, data: { mode: 'create' } },
  { path: 'products/edit/:id', component: ProductFormComponent, data: { mode: 'edit' } },

  // Categories
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent, data: { mode: 'create' } },
  { path: 'categories/edit/:id', component: CategoryFormComponent, data: { mode: 'edit' } },

  // Suppliers
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/new', component: SupplierFormComponent, data: { mode: 'create' } },
  { path: 'suppliers/edit/:id', component: SupplierFormComponent, data: { mode: 'edit' } },

  // Purchases
  { path: 'purchases', component: PurchaseListComponent },
  { path: 'purchases/new', component: PurchaseFormComponent, data: { mode: 'create' } },
  { path: 'purchases/edit/:id', component: PurchaseFormComponent, data: { mode: 'edit' } },

  // Sales
  { path: 'sales', component: SaleListComponent },
  { path: 'sales/new', component: SaleFormComponent, data: { mode: 'create' } },
  { path: 'sales/edit/:id', component: SaleFormComponent, data: { mode: 'edit' } },

  // Stores
  { path: 'stores', component: StoreListComponent },
  { path: 'stores/new', component: StoreFormComponent },
  { path: 'stores/edit/:id', component: StoreFormComponent },

  // Inventories
  { path: 'inventories', component: InventoryListComponent },
  { path: 'inventories/new', component: InventoryFormComponent },
  { path: 'inventories/edit/:id', component: InventoryFormComponent },

  // Transactions
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },

  // Fallback
  { path: '**', redirectTo: 'products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
