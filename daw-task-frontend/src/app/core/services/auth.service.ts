import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RefreshDTO, RegisterRequest, User } from '../models/auth.models';
import { tap, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:8081/auth';

    currentUser = signal<User | null>(this.getUserFromStorage());
    isLoggedIn = signal<boolean>(!!this.currentUser());

    constructor() { }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.saveTokens(response))
        );
    }

    // Register sends a LoginRequest (or similar) and returns token in Authorization header
    register(credentials: LoginRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, credentials, { observe: 'response' }).pipe(
            tap(response => {
                const token = response.headers.get('Authorization');
                if (token) {
                    // It might be "Bearer <token>" or just token.
                    // Usually clean it.
                    const cleanToken = token.replace('Bearer ', '');
                    // We don't get a refresh token here based on the controller? 
                    // If register autologins, we might need refresh token too. 
                    // But controller only adds one header.
                    // For now, let's just save the access token if present, but we might miss refresh token.
                    // Maybe we should just redirect to login or force login after register.
                    // Let's assume we force login or redirect for now to be safe, unless we see otherwise.
                }
            })
        );
    }

    refreshToken(): Observable<LoginResponse> {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
            this.logout();
            return of(); // Should probably throw or handle in interceptor
        }
        return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refresh }).pipe(
            tap(response => this.saveTokens(response))
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        this.router.navigate(['/auth/login']);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private saveTokens(response: LoginResponse): void {
        localStorage.setItem('access_token', response.access);
        if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
        }

        this.decodeAndSetUser(response.access);
    }

    private getUserFromStorage(): User | null {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                return jwtDecode<User>(token);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    private decodeAndSetUser(token: string): void {
        try {
            const user = jwtDecode<User>(token);
            this.currentUser.set(user);
            this.isLoggedIn.set(true);
        } catch (e) {
            this.logout();
        }
    }
}
