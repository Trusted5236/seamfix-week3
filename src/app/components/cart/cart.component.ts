import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';
import { forkJoin, Subject, takeUntil, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: Product[] = [];
  loading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    const cartIds = this.productService.getCartItems();

    if (cartIds.length === 0) {
      this.loading = false;
      return;
    }

    // Fetch all cart products in parallel with error handling
    const requests = cartIds.map(id => 
      this.productService.getProductById(id).pipe(
        catchError(error => {
          console.warn(`Product ${id} not found (404), removing from cart`);
          // Remove invalid product from cart
          this.productService.removeFromCart(id);
          // Return null for products that don't exist
          return of(null);
        })
      )
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          // Filter out null values (products that weren't found)
          this.cartProducts = products.filter(p => p !== null) as Product[];
          this.loading = false;
          
          // Log for debugging
          if (this.cartProducts.length === 0) {
            console.log('All cart items were invalid and have been removed');
          }
        },
        error: (err) => {
          console.error('Error fetching cart products:', err);
          this.loading = false;
        }
      });
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
    this.cartProducts = this.cartProducts.filter(p => p.id !== productId);
  }

  getTotalPrice(): number {
    return this.cartProducts.reduce((sum, product) => sum + product.price, 0);
  }
}