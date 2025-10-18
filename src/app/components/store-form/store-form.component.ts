import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html'
})
export class StoreFormComponent implements OnInit {

  storeForm!: FormGroup;
  storeId?: number;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initialize form
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      contactNumber: ['']
    });

    // Check if we are in edit mode
    this.route.params.subscribe(params => {
      this.storeId = +params['id'];
      if (this.storeId) {
        this.isEditMode = true;
        this.loadStore(this.storeId);
      }
    });
  }

  loadStore(id: number) {
    this.storeService.getStore(id).subscribe((store: Store) => {
      this.storeForm.patchValue({
        name: store.name,
        address: store.address,
        contactNumber: store.contactNumber
      });
    });
  }

  onSubmit() {
    if (this.storeForm.invalid) {
      return;
    }

    const storeData: Store = this.storeForm.value;

    if (this.isEditMode && this.storeId) {
      this.storeService.updateStore(this.storeId, storeData).subscribe(() => {
        alert('Store updated successfully');
        this.router.navigate(['/stores']);
      });
    } else {
      this.storeService.createStore(storeData).subscribe(() => {
        alert('Store created successfully');
        this.router.navigate(['/stores']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/stores']);
  }
}
