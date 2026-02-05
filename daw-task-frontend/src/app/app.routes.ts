import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'tareas', pathMatch: 'full' },
            {
                path: 'tareas',
                loadChildren: () => import('./features/tasks/task.routes').then(m => m.TASK_ROUTES)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
