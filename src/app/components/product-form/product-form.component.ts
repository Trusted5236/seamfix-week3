import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StateService } from '../../services/state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  loading$!: Observable<boolean>;
  categories: string[] = ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden', 'Sports'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private stateService: StateService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loading$ = this.stateService.loading$;
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(50)]],
      category: [''],
      imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      inStock: [true],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      properties: this.fb.array([])
    });
  }

  createProperty(): FormGroup {
    return this.fb.group({
      color: ['', Validators.required],
      weight: ['', Validators.required]
    });
  }

  get properties(): FormArray {
    return this.productForm.get('properties') as FormArray;
  }

  addProperty(): void {
    this.properties.push(this.createProperty());
  }

  removeProperty(index: number): void {
    if (this.properties.length > 1) {
      this.properties.removeAt(index);
    }
  }

  getPropertyFormGroup(index: number): FormGroup {
    return this.properties.at(index) as FormGroup;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isPropertyFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.getPropertyFormGroup(index).get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} cannot exceed ${field.errors['max'].max}`;
      if (field.errors['pattern']) return `${fieldName} must be a valid URL`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      
      const { properties, ...productData } = formValue;
      
      if (!productData.category) {
        delete productData.category;
      }
      
      this.successMessage = '';
      this.errorMessage = '';
      
      this.productService.createProduct(productData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.successMessage = 'Product created successfully!';
          this.errorMessage = '';
          this.productForm.reset();
          this.initializeForm();
          
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.errorMessage = error.message || 'Error creating product. Please try again.';
          this.successMessage = '';
        }
      });
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      this.properties.controls.forEach(control => {
        Object.keys((control as FormGroup).controls).forEach(key => {
          control.get(key)?.markAsTouched();
        });
      });
    }
  }
}