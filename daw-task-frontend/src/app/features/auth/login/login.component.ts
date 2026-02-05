import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        
        <div class="bg-slate-900 p-8 text-center">
           <h2 class="text-3xl font-bold text-white mb-2">Welcome Back</h2>
           <p class="text-slate-400">Sign in to manage your tasks</p>
        </div>

        <div class="p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="space-y-2">
              <label for="username" class="text-sm font-medium text-slate-700">Username</label>
              <input id="username" type="text" formControlName="username" 
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                [class.border-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                placeholder="Enter your username">
              <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.errors?.['required']" class="text-red-500 text-xs mt-1">
                 Username is required
              </div>
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-slate-700">Password</label>
              <input id="password" type="password" formControlName="password" 
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="••••••••">
               <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']" class="text-red-500 text-xs mt-1">
                 Password is required
              </div>
            </div>

            <div *ngIf="errorMessage()" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start">
               <span class="mr-2">⚠️</span>
               {{ errorMessage() }}
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading()" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30">
              {{ isLoading() ? 'Signing in...' : 'Sign In' }}
            </button>

            <div class="text-center mt-4">
              <p class="text-sm text-slate-500">
                Don't have an account? 
                <a routerLink="/auth/register" class="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Register</a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    isLoading = signal(false);
    errorMessage = signal('');

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');

            this.authService.login(this.loginForm.getRawValue() as any).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.isLoading.set(false);
                    if (err.status === 401) {
                        this.errorMessage.set('Invalid credentials');
                    } else {
                        this.errorMessage.set('Something went wrong. Please try again.');
                    }
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
