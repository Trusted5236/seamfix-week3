import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.models';

export interface AppState {
  products: Product[];
  cart: number[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  products: [],
  cart: [],
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state$ = new BehaviorSubject<AppState>(initialState);

  // Read-only observables
  readonly products$ = this.state$.asObservable().pipe(map(state => state.products));
  readonly cart$ = this.state$.asObservable().pipe(map(state => state.cart));
  readonly loading$ = this.state$.asObservable().pipe(map(state => state.loading));
  readonly error$ = this.state$.asObservable().pipe(map(state => state.error));

  // Selectors
  readonly cartCount$ = this.cart$.pipe(map(cart => cart.length));
  
  getProductById$(id: number): Observable<Product | undefined> {
    return this.products$.pipe(map(products => products.find(p => p.id === id)));
  }

  isInCart$(productId: number): Observable<boolean> {
    return this.cart$.pipe(map(cart => cart.includes(productId)));
  }

  // State update methods
  setProducts(products: Product[]): void {
    this.state$.next({ ...this.state$.value, products });
  }

  addProduct(product: Product): void {
    const products = [...this.state$.value.products, product];
    this.state$.next({ ...this.state$.value, products });
  }

  setCart(cart: number[]): void {
    this.state$.next({ ...this.state$.value, cart });
  }

  addToCart(productId: number): void {
    const currentCart = this.state$.value.cart;
    if (!currentCart.includes(productId)) {
      const cart = [...currentCart, productId];
      this.state$.next({ ...this.state$.value, cart });
    }
  }

  removeFromCart(productId: number): void {
    const cart = this.state$.value.cart.filter(id => id !== productId);
    this.state$.next({ ...this.state$.value, cart });
  }

  clearCart(): void {
    this.state$.next({ ...this.state$.value, cart: [] });
  }

  setLoading(loading: boolean): void {
    this.state$.next({ ...this.state$.value, loading });
  }

  setError(error: string | null): void {
    this.state$.next({ ...this.state$.value, error });
  }

  clearError(): void {
    this.setError(null);
  }

  // Get current state values synchronously
  getCurrentState(): AppState {
    return this.state$.value;
  }
}