import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col space-y-4">
       <div *ngFor="let toast of toastService.toasts()" 
            class="min-w-[300px] p-4 rounded-lg shadow-lg border-l-4 transform transition-all animate-slide-in"
            [ngClass]="{
               'bg-white border-green-500 text-green-700': toast.type === 'success',
               'bg-white border-red-500 text-red-700': toast.type === 'error',
               'bg-white border-blue-500 text-blue-700': toast.type === 'info'
            }">
            <div class="flex justify-between items-start">
               <div class="flex items-center">
                  <span class="mr-2 text-xl" *ngIf="toast.type === 'success'">✅</span>
                  <span class="mr-2 text-xl" *ngIf="toast.type === 'error'">🚨</span>
                  <span class="mr-2 text-xl" *ngIf="toast.type === 'info'">ℹ️</span>
                  <p class="font-medium text-sm">{{ toast.message }}</p>
               </div>
               <button (click)="toastService.remove(toast.id)" class="text-slate-400 hover:text-slate-600 ml-4">✕</button>
            </div>
       </div>
    </div>
  `,
    styles: [`
    @keyframes slideIn {
       from { transform: translateX(100%); opacity: 0; }
       to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
       animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);
}
