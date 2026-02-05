import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        
        <div class="bg-slate-900 p-8 text-center">
           <h2 class="text-3xl font-bold text-white mb-2">Create Account</h2>
           <p class="text-slate-400">Join DawTask today</p>
        </div>

        <div class="p-8">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="space-y-2">
              <label for="username" class="text-sm font-medium text-slate-700">Username</label>
              <input id="username" type="text" formControlName="username" 
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                placeholder="Choose a username">
               <div *ngIf="registerForm.get('username')?.touched" class="text-red-500 text-xs mt-1">
                 <span *ngIf="registerForm.get('username')?.errors?.['required']">Username is required</span>
                 <span *ngIf="registerForm.get('username')?.errors?.['minlength']">Min 3 chars</span>
              </div>
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-slate-700">Email</label>
              <input id="email" type="email" formControlName="email" 
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="you@example.com">
               <div *ngIf="registerForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
                 <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                 <span *ngIf="registerForm.get('email')?.errors?.['email']">Invalid email</span>
              </div>
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-slate-700">Password</label>
              <input id="password" type="password" formControlName="password" 
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="••••••••">
               <div *ngIf="registerForm.get('password')?.touched" class="text-red-500 text-xs mt-1">
                 <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                 <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Min 6 chars</span>
              </div>
            </div>

            <div *ngIf="errorMessage()" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start">
               <span class="mr-2">⚠️</span>
               {{ errorMessage() }}
            </div>

            <button type="submit" [disabled]="registerForm.invalid || isLoading()" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30">
              {{ isLoading() ? 'Creating Account...' : 'Register' }}
            </button>

            <div class="text-center mt-4">
              <p class="text-sm text-slate-500">
                Already have an account? 
                <a routerLink="/auth/login" class="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Sign In</a>
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
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    isLoading = signal(false);
    errorMessage = signal('');

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');

            this.authService.register(this.registerForm.getRawValue() as any).subscribe({
                next: () => {
                    // Success, redirect to login
                    this.router.navigate(['/auth/login']);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.isLoading.set(false);
                    this.errorMessage.set(err?.error?.message || 'Registration failed. Please try again.');
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
