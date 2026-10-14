// add-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  brands: any[] = [];
  productTypes: any[] = [];
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      brandId: ['', Validators.required],
      productTypeId: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

ngOnInit(): void {
    this.loadBrands();
    this.loadProductTypes();
  }

  loadBrands() {
    this.productService.getBrands().subscribe({
      next: (brands) => {
        console.log('Brands:', brands); // Debug log
        this.brands = brands;
      },
      error: (err) => console.error('Failed to load brands:', err)
    });
  }

  loadProductTypes() {
    this.productService.getProductTypes().subscribe({
      next: (types) => {
        console.log('Product Types:', types); // Debug log
        this.productTypes = types;
      },
      error: (err) => console.error('Failed to load product types:', err)
    });
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) {
      this.snackBar.open('Please fill all required fields and select an image', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

  const formData = new FormData();
  formData.append('name', this.productForm.value.name);
  formData.append('price', this.productForm.value.price.toString());

  // Match API field names (lowercase):
  formData.append('brand', this.productForm.value.brandId.toString()); // was "brandId"
  formData.append('producttype', this.productForm.value.productTypeId.toString()); // was "productTypeId"

  formData.append('description', this.productForm.value.description);
  formData.append('file', this.selectedFile);

      this.productService.addProduct(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open(`${this.productForm.value.name} created successfully`, 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error adding product:', err);
          this.snackBar.open('Error creating product', 'Close', { duration: 3000 });
        }
  });
};
}

