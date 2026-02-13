import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.models';
import { ErrorHandlerService } from './error-handler.service';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private cartKey = 'cart';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private stateService: StateService
  ) {
    // Load cart from localStorage and sync with StateService
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cart = localStorage.getItem(this.cartKey);
    const loadedCart = cart ? JSON.parse(cart) : [];
    this.stateService.setCart(loadedCart);
    console.log('Cart loaded from localStorage:', loadedCart);
  }

  private saveCartToStorage(cart: number[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
  }

  getAllProducts(): Observable<Product[]> {
    this.stateService.setLoading(true);
    this.stateService.clearError();
    
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => {
        this.stateService.setProducts(products);
        this.stateService.setLoading(false);
      }),
      catchError(error => {
        this.stateService.setLoading(false);
        return this.errorHandler.handleError(error);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    this.stateService.setLoading(true);
    this.stateService.clearError();
    
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.stateService.setLoading(false)),
      catchError(error => {
        this.stateService.setLoading(false);
        return this.errorHandler.handleError(error);
      })
    );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    this.stateService.setLoading(true);
    this.stateService.clearError();
    
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(newProduct => {
        this.stateService.addProduct(newProduct);
        this.stateService.setLoading(false);
      }),
      catchError(error => {
        this.stateService.setLoading(false);
        return this.errorHandler.handleError(error);
      })
    );
  }

  addToCart(productId: number): void {
    this.stateService.addToCart(productId);
    const cart = this.stateService.getCurrentState().cart;
    this.saveCartToStorage(cart);
  }

  removeFromCart(productId: number): void {
    this.stateService.removeFromCart(productId);
    const cart = this.stateService.getCurrentState().cart;
    this.saveCartToStorage(cart);
  }

  clearCart(): void {
    this.stateService.clearCart();
    localStorage.removeItem(this.cartKey);
  }
}