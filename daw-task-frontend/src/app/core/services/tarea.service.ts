import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

export enum Estado {
    PENDIENTE = 'PENDIENTE',
    EN_PROGRESO = 'EN_PROGRESO',
    COMPLETADA = 'COMPLETADA'
}

export interface Tarea {
    id?: number;
    titulo: string;
    descripcion: string;
    fechaCreacion?: string; // LocalDate yyyy-MM-dd
    fechaVencimiento: string; // LocalDate yyyy-MM-dd
    estado?: Estado;
    idUsuario?: number;
}

@Injectable({
    providedIn: 'root'
})
export class TareaService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8081/tareas';

    // Signals for state - optional, but requested "prefiere servicios con Signals"
    // We can expose a signal that updates when we fetch tasks.
    tasks = signal<Tarea[]>([]);

    constructor() { }

    findAll(): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(this.apiUrl).pipe(
            tap(tasks => this.tasks.set(tasks))
        );
    }

    findById(id: number): Observable<Tarea> {
        return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
    }

    create(tarea: Tarea): Observable<Tarea> {
        // Strict handling: Remove id, estado, fechaCreacion if present (though interface optional)
        const { id, estado, fechaCreacion, ...payload } = tarea;
        return this.http.post<Tarea>(this.apiUrl, payload).pipe(
            tap(() => this.findAll().subscribe()) // Re-fetch list
        );
    }

    update(id: number, tarea: Tarea): Observable<Tarea> {
        // Strict handling
        const { id: _, estado, fechaCreacion, ...payload } = tarea;
        // Backend requires id in body?
        // Backend: update(@PathVariable int idTarea, @RequestBody Tarea tarea)
        // if (tarea.getId() != idTarea) throw ...
        // So we MUST include ID in body matching the path.

        // Let's re-read TareaService.java update check.
        // if (tarea.getId() != idTarea)

        // So payload MUST have id.
        const updatePayload = { ...payload, id };

        return this.http.put<Tarea>(`${this.apiUrl}/${id}`, updatePayload).pipe(
            tap(() => this.findAll().subscribe())
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.tasks.update(current => current.filter(t => t.id !== id));
            })
        );
    }

    iniciar(id: number): Observable<Tarea> {
        return this.http.put<Tarea>(`${this.apiUrl}/${id}/iniciar`, {}).pipe(
            tap(() => this.findAll().subscribe())
        );
    }

    // Endpoints for filters
    getPendientes(): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(`${this.apiUrl}/pendientes`);
    }

    getEnProgreso(): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(`${this.apiUrl}/en-progreso`);
    }

    getCompletadas(): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(`${this.apiUrl}/completadas`);
    }
}
