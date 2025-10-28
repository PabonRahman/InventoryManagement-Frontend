import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  category: Category = {
    name: '',
    description: '',
    productCount: 0  // Add this with default value
  };
  
  isEditMode = false;
  loading = false;
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCategory(Number(id));
    }
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        // Make sure productCount is properly set when loading existing category
        this.category = {
          ...category,
          productCount: category.productCount || 0
        };
        this.loading = false;
        console.log('Category loaded successfully:', this.category);
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.errorMessage = 'Error loading category: ' + error.message;
        this.loading = false;
      }
    });
  }

  saveCategory(): void {
    // Validation
    if (!this.category.name?.trim()) {
      this.errorMessage = 'Category name is required';
      return;
    }

    if (this.category.name.trim().length < 2) {
      this.errorMessage = 'Category name must be at least 2 characters long';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Prepare data for API - don't include productCount in create/update
    const categoryData: any = {
      name: this.category.name.trim(),
      description: this.category.description?.trim() || ''
    };

    // Only include ID for update operations
    if (this.isEditMode && this.category.id) {
      categoryData.id = this.category.id;
    }

    console.log('Saving category data:', categoryData);

    const saveOperation = this.isEditMode 
      ? this.categoryService.updateCategory(this.category.id!, categoryData)
      : this.categoryService.createCategory(categoryData);

    saveOperation.subscribe({
      next: (savedCategory) => {
        this.loading = false;
        console.log('Category saved successfully:', savedCategory);
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Error saving category:', error);
        this.errorMessage = this.extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  // Helper method to extract error messages
  private extractErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error.error && error.error.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}