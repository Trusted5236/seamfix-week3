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
  
  private cartItems = new BehaviorSubject<number[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) { }

  private loadCartFromStorage(): number[] {
    const cart = localStorage.getItem(this.cartKey);
    const loadedCart = cart ? JSON.parse(cart) : [];
    console.log('Cart loaded from localStorage:', loadedCart);
    return loadedCart;
  }

  private saveCartToStorage(cart: number[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl); 
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // NEW METHOD - accepts partial product (without id) and returns full product (with id)
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  isInCart(productId: number): boolean {
    return this.cartItems.value.includes(productId);
  }

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

  removeFromCart(productId: number): void {
    const currentCart = this.cartItems.value.filter(id => id !== productId);
    this.cartItems.next(currentCart);
    this.saveCartToStorage(currentCart);
    console.log('Product removed from cart:', productId);
  }

  getCartItems(): number[] {
    return this.cartItems.value;
  }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem(this.cartKey);
    console.log('Cart cleared');
  }

  getCartCount(): number {
    return this.cartItems.value.length;
  }
}