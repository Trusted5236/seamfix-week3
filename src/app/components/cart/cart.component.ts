import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StateService } from '../../services/state.service';
import { Product } from '../../models/product.models';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartProducts$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  totalPrice$!: Observable<number>;

  constructor(
    private productService: ProductService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.loading$ = this.stateService.loading$;
    
    // Get cart products by combining cart IDs with products from state
    this.cartProducts$ = combineLatest([
      this.stateService.cart$,
      this.stateService.products$
    ]).pipe(
      map(([cartIds, products]) => {
        return cartIds
          .map(id => products.find(p => p.id === id))
          .filter(p => p !== undefined) as Product[];
      })
    );

    // Calculate total price
    this.totalPrice$ = this.cartProducts$.pipe(
      map(products => products.reduce((sum, product) => sum + product.price, 0))
    );

    // Load products if not already loaded
    this.stateService.products$.pipe(
      map(products => products.length)
    ).subscribe(length => {
      if (length === 0) {
        this.productService.getAllProducts().subscribe();
      }
    });
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
  }
}