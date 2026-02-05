import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TareaService, Tarea } from '../../../core/services/tarea.service';

@Component({
    selector: 'app-task-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    template: `
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-100" *ngIf="task(); else loading">
       
       <div class="flex items-center justify-between mb-6">
          <a routerLink="/tareas" class="text-slate-500 hover:text-blue-600 transition-colors flex items-center">
             <span class="mr-2">←</span> Back to list
          </a>
          <div class="flex space-x-3">
             <a [routerLink]="['/tareas', task()!.id, 'edit']" class="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">Edit</a>
          </div>
       </div>

       <h1 class="text-3xl font-bold text-slate-900 mb-4">{{ task()!.titulo }}</h1>
       
       <div class="flex items-center space-x-4 mb-8">
          <span class="px-3 py-1 rounded-full text-sm font-semibold tracking-wide" 
             [ngClass]="{
                 'bg-yellow-100 text-yellow-700': task()!.estado === 'PENDIENTE',
                 'bg-blue-100 text-blue-700': task()!.estado === 'EN_PROGRESO',
                 'bg-green-100 text-green-700': task()!.estado === 'COMPLETADA'
              }">
              {{ task()!.estado }}
          </span>
          <span class="text-slate-500 text-sm flex items-center">
             📅 Due: {{ task()!.fechaVencimiento | date:'fullDate' }}
          </span>
       </div>

       <div class="prose prose-slate max-w-none">
          <h3 class="text-lg font-semibold text-slate-800 mb-2">Description</h3>
          <p class="text-slate-600 leading-relaxed whitespace-pre-wrap">{{ task()!.descripcion }}</p>
       </div>

    </div>
    <ng-template #loading>
       <div class="text-center py-12">Loading...</div>
    </ng-template>
  `
})
export class TaskDetailComponent {
    route = inject(ActivatedRoute);
    tareaService = inject(TareaService);
    task = signal<Tarea | null>(null);

    constructor() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.tareaService.findById(+id).subscribe(t => this.task.set(t));
        }
    }
}
