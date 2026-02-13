import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { StateService } from '../../services/state.service';
import { Product } from '../../models/product.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  searchTerm: string = '';
  filteredProducts$!: Observable<Product[]>;

  constructor(
    public productService: ProductService,
    public stateService: StateService
  ) {}

  ngOnInit(): void {
    this.products$ = this.stateService.products$;
    this.loading$ = this.stateService.loading$;
    this.error$ = this.stateService.error$;
    this.filteredProducts$ = this.products$;
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      error: (err) => {
        this.stateService.setError(err.message);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm === '') {
      this.filteredProducts$ = this.products$;
    } else {
      this.filteredProducts$ = this.products$.pipe(
        map(products => products.filter(product =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        ))
      );
    }
  }

  onProductSelect(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    this.stateService.isInCart$(product.id).subscribe(isInCart => {
      if (isInCart) {
        this.productService.removeFromCart(product.id);
      } else {
        this.productService.addToCart(product.id);
      }
    });
  }

  isSelected$(productId: number): Observable<boolean> {
    return this.stateService.isInCart$(productId);
  }
}