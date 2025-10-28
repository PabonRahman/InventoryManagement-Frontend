import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all components
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseFormComponent } from './components/purchase-form/purchase-form.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminBoardComponent } from './components/admin-board/admin-board.component';
import { ModeratorBoardComponent } from './components/moderator-board/moderator-board.component';
import { UserBoardComponent } from './components/user-board/user-board.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Role constants for better maintainability
const ROLES = {
  USER: ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'],
  MODERATOR: ['ROLE_MODERATOR', 'ROLE_ADMIN'],
  ADMIN: ['ROLE_ADMIN']
};

const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { title: 'Access Denied' } },

  // Dashboard routes
  { 
    path: 'user-dashboard', 
    component: UserBoardComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'User Dashboard',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'mod-dashboard', 
    component: ModeratorBoardComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Moderator Dashboard',
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'admin-dashboard', 
    component: AdminBoardComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Admin Dashboard',
      expectedRoles: ROLES.ADMIN 
    }
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard],
    data: { title: 'My Profile' }
  },

  // Products
  { 
    path: 'products', 
    component: ProductListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Products',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Add Product',
      mode: 'create', 
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'products/edit/:id', 
    component: ProductFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Edit Product',
      mode: 'edit', 
      expectedRoles: ROLES.MODERATOR 
    }
  },

  // Categories
  { 
    path: 'categories', 
    component: CategoryListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Categories',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'categories/new', 
    component: CategoryFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Add Category',
      mode: 'create', 
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'categories/edit/:id', 
    component: CategoryFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Edit Category',
      mode: 'edit', 
      expectedRoles: ROLES.MODERATOR 
    }
  },

  // Suppliers
  { 
    path: 'suppliers', 
    component: SupplierListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Suppliers',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'suppliers/new', 
    component: SupplierFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Add Supplier',
      mode: 'create', 
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'suppliers/edit/:id', 
    component: SupplierFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Edit Supplier',
      mode: 'edit', 
      expectedRoles: ROLES.MODERATOR 
    }
  },

  // Purchases
  { 
    path: 'purchases', 
    component: PurchaseListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Purchases',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'purchases/new', 
    component: PurchaseFormComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Add Purchase',
      mode: 'create', 
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'purchases/edit/:id', 
    component: PurchaseFormComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Edit Purchase',
      mode: 'edit', 
      expectedRoles: ROLES.USER 
    }
  },

  // Sales
  { 
    path: 'sales', 
    component: SaleListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Sales',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'sales/new', 
    component: SaleFormComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Add Sale',
      mode: 'create', 
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'sales/edit/:id', 
    component: SaleFormComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Edit Sale',
      mode: 'edit', 
      expectedRoles: ROLES.USER 
    }
  },

  // Stores
  { 
    path: 'stores', 
    component: StoreListComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Stores',
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'stores/new', 
    component: StoreFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Add Store',
      mode: 'create',
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'stores/edit/:id', 
    component: StoreFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Edit Store',
      mode: 'edit',
      expectedRoles: ROLES.MODERATOR 
    }
  },

  // Inventories
  { 
    path: 'inventories', 
    component: InventoryListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Inventories',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'inventories/new', 
    component: InventoryFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Add Inventory',
      mode: 'create',
      expectedRoles: ROLES.MODERATOR 
    }
  },
  { 
    path: 'inventories/edit/:id', 
    component: InventoryFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Edit Inventory',
      mode: 'edit',
      expectedRoles: ROLES.MODERATOR 
    }
  },

  // Transactions
  { 
    path: 'transactions', 
    component: TransactionListComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Transactions',
      expectedRoles: ROLES.USER 
    }
  },
  { 
    path: 'transactions/new', 
    component: TransactionFormComponent, 
    canActivate: [AuthGuard],
    data: { 
      title: 'Add Transaction',
      mode: 'create',
      expectedRoles: ROLES.USER 
    }
  },

  // Default and fallback routes
  { path: '', redirectTo: 'user-dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'user-dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging routes
    scrollPositionRestoration: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }