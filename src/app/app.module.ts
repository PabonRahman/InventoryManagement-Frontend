import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Add this import

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
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminBoardComponent } from './components/admin-board/admin-board.component';
import { ModeratorBoardComponent } from './components/moderator-board/moderator-board.component';
import { UserBoardComponent } from './components/user-board/user-board.component'; // ✅ Make sure this is imported
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';

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
    TransactionListComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AdminBoardComponent,
    ModeratorBoardComponent,
    UserBoardComponent, // ✅ Make sure this is in declarations
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // ✅ This should include RouterModule already
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule // ✅ Add this to be safe
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }