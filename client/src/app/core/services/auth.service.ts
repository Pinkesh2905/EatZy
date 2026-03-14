import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../config/api.config';
import {
  AuthenticatedUser,
  LoginCredentials,
  RegisterPayload,
  UserProfile,
  UserRole
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${API_BASE_URL}/auth`;
  private readonly storageKey = 'eatzy_user';

  currentUser = signal<AuthenticatedUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  register(userData: RegisterPayload): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(`${this.apiUrl}/register`, userData).pipe(
      tap(user => this.setSession(user))
    );
  }

  login(credentials: LoginCredentials): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => this.setSession(user))
    );
  }

  refreshProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        const current = this.currentUser();
        if (current) {
          this.setSession({ ...current, ...user });
        }
      })
    );
  }

  logout(redirectUrl = '/auth/login') {
    this.clearSession();
    this.router.navigateByUrl(redirectUrl);
  }

  completeLogin(returnUrl?: string | null) {
    const target = returnUrl || this.getDefaultRoute();
    this.router.navigateByUrl(target);
  }

  getDefaultRoute(role: UserRole | undefined = this.currentUser()?.role): string {
    switch (role) {
      case 'home_chef':
        return '/chef/dashboard';
      case 'delivery_partner':
        return '/delivery/dashboard';
      case 'admin':
        return '/admin/overview';
      default:
        return '/home';
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser()?.token;
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }

  private restoreSession() {
    if (typeof window === 'undefined') {
      return;
    }

    const savedUser = window.localStorage.getItem(this.storageKey);
    if (!savedUser) {
      return;
    }

    try {
      this.currentUser.set(JSON.parse(savedUser) as AuthenticatedUser);
    } catch {
      this.clearSession();
    }
  }

  private clearSession() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey);
    }

    this.currentUser.set(null);
  }

  private setSession(user: AuthenticatedUser) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(user));
    }

    this.currentUser.set(user);
  }
}
