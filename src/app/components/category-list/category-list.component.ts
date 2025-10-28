import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  
  // Search and filter properties
  searchTerm: string = '';
  
  // Loading states
  loading = false;
  deleting = false;
  deleteCategoryId: number | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories loaded:', categories); // Debug log
        this.categories = categories;
        this.filteredCategories = [...categories];
        this.totalItems = categories.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        alert('Error loading categories: ' + error.message);
        this.loading = false;
      }
    });
  }

  // Search and filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.categories;

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(term) ||
        (category.description && category.description.toLowerCase().includes(term))
      );
    }

    this.filteredCategories = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Pagination methods
  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // CRUD operations
  editCategory(category: Category): void {
    this.router.navigate(['/categories/edit', category.id]);
  }

  viewCategory(category: Category): void {
    this.router.navigate(['/categories/view', category.id]);
  }

  deleteCategory(category: Category): void {
    if (!category.id) return;

    // Check if category has products
    if (this.hasProducts(category)) {
      const confirmed = confirm(
        `Warning: Category "${category.name}" contains ${category.productCount} product(s).\n\n` +
        `Deleting this category will remove all associated products. Are you sure you want to continue?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = confirm(`Are you sure you want to delete the category "${category.name}"?`);
      if (!confirmed) return;
    }

    this.deleting = true;
    this.deleteCategoryId = category.id;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        // Success - remove from list
        this.categories = this.categories.filter(c => c.id !== category.id);
        this.applyFilters();
        this.deleting = false;
        this.deleteCategoryId = null;
        
        // Show success message
        this.showSuccessMessage(`Category "${category.name}" deleted successfully!`);
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.deleting = false;
        this.deleteCategoryId = null;
        
        // Enhanced error handling
        this.handleDeleteError(error, category);
      }
    });
  }

  addNewCategory(): void {
    this.router.navigate(['/categories/new']);
  }

  // Enhanced Error Handling
  private handleDeleteError(error: any, category: Category): void {
    let userMessage = '';
    let showViewProductsOption = false;

    // Check for specific error patterns
    if (error.message.includes('in use') || 
        error.message.includes('Bad request') ||
        error.message.includes('foreign key') ||
        error.message.includes('constraint')) {
      
      userMessage = `Cannot delete "${category.name}" because it contains ${category.productCount} product(s). 

This category is currently being used by products. To delete it, you need to:

✓ Delete all products in this category first, OR
✓ Move products to another category before deleting

Would you like to view the products in this category?`;
      showViewProductsOption = true;
    } else if (error.message.includes('not found')) {
      userMessage = `Category "${category.name}" was not found. It may have already been deleted.`;
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      userMessage = `You do not have permission to delete the category "${category.name}".`;
    } else {
      userMessage = `Error deleting "${category.name}": ${error.message}`;
    }

    // Show appropriate dialog
    if (showViewProductsOption) {
      const viewProducts = confirm(userMessage);
      if (viewProducts) {
        // Navigate to products page filtered by this category
        this.router.navigate(['/products'], { 
          queryParams: { category: category.id } 
        });
      }
    } else {
      alert(userMessage);
    }
  }

  private showSuccessMessage(message: string): void {
    // You can replace this with a toast notification service
    alert(message);
  }

  // UPDATED: Use productCount from the API instead of calculating from products array
  getProductCount(category: Category): number {
    // Use the productCount provided by the backend API
    return category.productCount || 0;
  }

  getDescriptionPreview(description: string): string {
    if (!description) return 'No description';
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  // UPDATED: Check if category has products using productCount
  hasProducts(category: Category): boolean {
    return this.getProductCount(category) > 0;
  }

  // Helper to get product count text with proper pluralization
  getProductCountText(category: Category): string {
    const count = this.getProductCount(category);
    return count === 1 ? '1 product' : `${count} products`;
  }
}