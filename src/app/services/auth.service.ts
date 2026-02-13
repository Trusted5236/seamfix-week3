import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_EMAIL_KEY = 'userEmail';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.USER_EMAIL_KEY);
  }

  login(email: string): void {
    localStorage.setItem(this.USER_EMAIL_KEY, email);
    this.isAuthenticatedSubject.next(true);
    console.log('User logged in:', email);
  }

  logout(): void {
    localStorage.removeItem(this.USER_EMAIL_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
    console.log('User logged out');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }
}