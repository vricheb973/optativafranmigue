import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TareaService } from '../../../core/services/tarea.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-100">
       
       <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-slate-800">New Task</h2>
          <a routerLink="/tareas" class="text-slate-500 hover:text-blue-600 transition-colors">Cancel</a>
       </div>

       <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <div class="space-y-2">
            <label for="titulo" class="text-sm font-medium text-slate-700">Title</label>
            <input id="titulo" type="text" formControlName="titulo" 
              class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g., Review Project Proposal">
            <div *ngIf="taskForm.get('titulo')?.touched && taskForm.get('titulo')?.invalid" class="text-red-500 text-xs">Title is required</div>
          </div>

          <div class="space-y-2">
            <label for="descripcion" class="text-sm font-medium text-slate-700">Description</label>
            <textarea id="descripcion" formControlName="descripcion" rows="4"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Add details..."></textarea>
          </div>

          <div class="space-y-2">
            <label for="fechaVencimiento" class="text-sm font-medium text-slate-700">Due Date</label>
            <input id="fechaVencimiento" type="date" formControlName="fechaVencimiento" 
              class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all">
             <div *ngIf="taskForm.get('fechaVencimiento')?.touched && taskForm.get('fechaVencimiento')?.invalid" class="text-red-500 text-xs">Valid future date is required</div>
          </div>

          <button type="submit" [disabled]="taskForm.invalid || isLoading()" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50">
            {{ isLoading() ? 'Creating...' : 'Create Task' }}
          </button>
       </form>

    </div>
  `
})
export class TaskCreateComponent {
  fb = inject(FormBuilder);
  tareaService = inject(TareaService);
  router = inject(Router);
  toastService = inject(ToastService);

  isLoading = signal(false);

  taskForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: [''],
    fechaVencimiento: ['', Validators.required]
  });

  onSubmit() {
    if (this.taskForm.valid) {
      this.isLoading.set(true);
      const val = this.taskForm.value;

      const payload: any = {
        titulo: val.titulo!,
        descripcion: val.descripcion || '',
        fechaVencimiento: val.fechaVencimiento!
      };

      this.tareaService.create(payload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastService.success('Task created successfully');
          this.router.navigate(['/tareas']);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
