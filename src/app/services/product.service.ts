import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private cartKey = 'cart';
  
  // BehaviorSubject to store cart items (reactive state management)
  private cartItems = new BehaviorSubject<number[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) { }

  // Load cart from localStorage on service initialization
  private loadCartFromStorage(): number[] {
    const cart = localStorage.getItem(this.cartKey);
    const loadedCart = cart ? JSON.parse(cart) : [];
    console.log('Cart loaded from localStorage:', loadedCart);
    return loadedCart;
  }

  // Save cart to localStorage
  private saveCartToStorage(cart: number[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
  }

  // Get all products from API
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl); 
  }

  // Get single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.cartItems.value.includes(productId);
  }

  // Add product to cart
  addToCart(productId: number): void {
    const currentCart = this.cartItems.value;
    if (!currentCart.includes(productId)) {
      const newCart = [...currentCart, productId];
      this.cartItems.next(newCart);
      this.saveCartToStorage(newCart);
      console.log('Product added to cart:', productId);
    } else {
      console.log('Product already in cart:', productId);
    }
  }

  // Remove product from cart
  removeFromCart(productId: number): void {
    const currentCart = this.cartItems.value.filter(id => id !== productId);
    this.cartItems.next(currentCart);
    this.saveCartToStorage(currentCart);
    console.log('Product removed from cart:', productId);
  }

  // Get cart items (returns the IDs)
  getCartItems(): number[] {
    return this.cartItems.value;
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem(this.cartKey);
    console.log('Cart cleared');
  }

  // Get cart count (useful for badge on cart icon)
  getCartCount(): number {
    return this.cartItems.value.length;
  }
}