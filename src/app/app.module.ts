import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';
import { PurchaseFormComponent } from './components/purchase-form/purchase-form.component';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryListComponent,
    CategoryFormComponent,
    ProductListComponent,
    ProductFormComponent,
    SupplierListComponent,
    SupplierFormComponent,
    PurchaseFormComponent,
    PurchaseListComponent,
    SaleListComponent,
    SaleFormComponent,
    StoreListComponent,
    StoreFormComponent,
    InventoryFormComponent,
    TransactionFormComponent,
    InventoryListComponent,
    TransactionListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }