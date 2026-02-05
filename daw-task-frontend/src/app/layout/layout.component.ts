import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
   selector: 'app-layout',
   standalone: true,
   imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
   template: `
    <app-toast />
    <div class="flex h-screen bg-slate-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div class="h-16 flex items-center px-6 border-b border-slate-800">
          <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DawTask</span>
        </div>
        
        <nav class="flex-1 py-6 px-3 space-y-1">
          <a routerLink="/tareas" 
             routerLinkActive="bg-slate-800 text-blue-400" 
             [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
             <!-- Icon Placeholder -->
             <span class="mr-3">📋</span>
             <span>Mis Tareas</span>
          </a>
          
          <a routerLink="/tareas/create" 
             routerLinkActive="bg-slate-800 text-blue-400"
             class="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
             <span class="mr-3">➕</span>
             <span>Nueva Tarea</span>
          </a>
          
          <div class="pt-4 mt-4 border-t border-slate-800">
             <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Filtros</p>
             <a routerLink="/tareas/pendientes" routerLinkActive="text-blue-400" class="flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Pendientes
             </a>
             <a routerLink="/tareas/en-progreso" routerLinkActive="text-blue-400" class="flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                En Progreso
             </a>
             <a routerLink="/tareas/completadas" routerLinkActive="text-blue-400" class="flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Completadas
             </a>
          </div>
        </nav>

        <div class="p-4 border-t border-slate-800">
          <div class="flex items-center">
             <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
               {{ (authService.currentUser()?.sub || 'U')[0].toUpperCase() }}
             </div>
             <div class="ml-3">
               <p class="text-sm font-medium text-white">{{ authService.currentUser()?.sub || 'User' }}</p>
               <p class="text-xs text-slate-400">Online</p>
             </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden relative">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 class="text-xl font-semibold text-slate-800">Dashboard</h1>
          
          <button (click)="logout()" 
             class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center">
             <span>Logout</span>
             <span class="ml-2">↪</span>
          </button>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
           <div class="max-w-6xl mx-auto animate-fade-in">
              <router-outlet />
           </div>
        </main>
      </div>
    </div>
  `,
   styles: [`
    .animate-fade-in {
       animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
       from { opacity: 0; transform: translateY(10px); }
       to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LayoutComponent {
   authService = inject(AuthService);
   router = inject(Router);

   logout() {
      this.authService.logout();
   }
}
