import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEditComponent } from './task-edit/task-edit.component';

export const TASK_ROUTES: Routes = [
    { path: '', component: TaskListComponent },
    { path: 'pendientes', component: TaskListComponent, data: { filter: 'PENDIENTE' } },
    { path: 'en-progreso', component: TaskListComponent, data: { filter: 'EN_PROGRESO' } },
    { path: 'completadas', component: TaskListComponent, data: { filter: 'COMPLETADA' } },
    { path: 'create', component: TaskCreateComponent },
    { path: ':id/edit', component: TaskEditComponent },
    { path: ':id', component: TaskDetailComponent }
];
