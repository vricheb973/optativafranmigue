import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TareaService, Tarea } from '../../../core/services/tarea.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    template: `
    <div class="space-y-6">
      
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">{{ getTitle() }}</h2>
          <p class="text-slate-500">Managing {{ tasks().length }} tasks</p>
        </div>
        <a routerLink="/tareas/create" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-lg hover:shadow-blue-500/30">
          <span class="mr-2">➕</span> New Task
        </a>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div *ngFor="let task of tasks()" class="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all p-5 flex flex-col group relative">
           <!-- Card Header -->
           <div class="flex justify-between items-start mb-3">
              <span [ngClass]="{
                 'bg-yellow-100 text-yellow-700': task.estado === 'PENDIENTE',
                 'bg-blue-100 text-blue-700': task.estado === 'EN_PROGRESO',
                 'bg-green-100 text-green-700': task.estado === 'COMPLETADA'
              }" class="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                 {{ task.estado }}
              </span>
              <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <a [routerLink]="['/tareas', task.id, 'edit']" class="text-slate-400 hover:text-blue-600 p-1" title="Edit">✏️</a>
                 <button (click)="deleteTask(task.id!)" class="text-slate-400 hover:text-red-600 p-1" title="Delete">🗑️</button>
              </div>
           </div>

           <!-- Content -->
           <div class="flex-1 cursor-pointer" [routerLink]="['/tareas', task.id]">
              <h3 class="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{{ task.titulo }}</h3>
              <p class="text-slate-500 text-sm line-clamp-2 mb-4">{{ task.descripcion }}</p>
           </div>
           
           <!-- Meta & Actions -->
           <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
             <div class="flex items-center">
               <span>📅 {{ task.fechaVencimiento | date:'mediumDate' }}</span>
             </div>
             
             <!-- Action Buttons -->
              <div class="flex space-x-2">
                <button *ngIf="task.estado === 'PENDIENTE'" (click)="startTask(task.id!)" class="text-blue-600 font-semibold hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                  Start ▶
                </button>
                <button *ngIf="task.estado === 'EN_PROGRESO'" (click)="completeTask(task.id!)" class="text-green-600 font-semibold hover:bg-green-50 px-2 py-1 rounded transition-colors">
                  Complete ✅
                </button>
              </div>
           </div>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="tasks().length === 0" class="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
           <p class="text-4xl mb-4">📭</p>
           <p class="text-lg font-medium">No tasks found</p>
           <p class="mb-4">Get started by creating a new task.</p>
           <a routerLink="/tareas/create" class="text-blue-600 font-semibold hover:underline">Create Task</a>
        </div>

      </div>
    </div>
  `
})
export class TaskListComponent {
    tareaService = inject(TareaService);
    authService = inject(AuthService);
    route = inject(ActivatedRoute);
    toastService = inject(ToastService);

    tasks = signal<Tarea[]>([]);
    currentFilter = signal<string | null>(null);

    constructor() {
        this.route.url.subscribe(() => {
            this.loadTasks();
        });
        this.route.data.subscribe(data => {
            this.currentFilter.set(data['filter'] || null);
            this.loadTasks();
        });
    }

    getTitle(): string {
        const filter = this.currentFilter();
        if (filter === 'PENDIENTE') return 'Pending Tasks';
        if (filter === 'EN_PROGRESO') return 'In Progress Tasks';
        if (filter === 'COMPLETADA') return 'Completed Tasks';
        return 'All Tasks';
    }

    loadTasks() {
        const filter = this.currentFilter();
        let obs;
        if (filter === 'PENDIENTE') obs = this.tareaService.getPendientes();
        else if (filter === 'EN_PROGRESO') obs = this.tareaService.getEnProgreso();
        else if (filter === 'COMPLETADA') obs = this.tareaService.getCompletadas();
        else obs = this.tareaService.findAll();

        obs.subscribe(data => this.tasks.set(data));
    }

    deleteTask(id: number) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tareaService.delete(id).subscribe({
                next: () => {
                    this.loadTasks();
                    this.toastService.success('Task deleted successfully');
                }
            });
        }
    }

    startTask(id: number) {
        this.tareaService.iniciar(id).subscribe({
            next: () => {
                this.loadTasks();
                this.toastService.success('Task started');
            }
        });
    }

    completeTask(id: number) {
        this.toastService.info('Complete functionality is not yet available in the backend.');
    }
}
