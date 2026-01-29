import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    if (this.searchTerm === '') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onProductSelect(product: Product, event: Event): void {
    // Prevent navigation when clicking the select button
    event.stopPropagation();
    event.preventDefault();
    
    if (this.isSelected(product.id)) {
      this.productService.removeFromCart(product.id);
    } else {
      this.productService.addToCart(product.id);
    }
  }

  isSelected(productId: number): boolean {
    return this.productService.isInCart(productId);
  }
}