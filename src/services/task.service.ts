import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CreateTaskRequest, Task } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private taskReminderService: any; // Will be injected via setter to avoid circular dependency

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Setter method to inject task reminder service (avoids circular dependency)
  setTaskReminderService(service: any) {
    this.taskReminderService = service;
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, this.getHttpOptions());
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    // Convert datetime-local string to proper Date object
    const taskData = { ...task };
    if (taskData.dueDate && typeof taskData.dueDate === 'string') {
      taskData.dueDate = new Date(taskData.dueDate);
    }
    return this.http.post<Task>(this.apiUrl, task, this.getHttpOptions());
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    // Convert datetime-local string to proper Date object
    const taskData = { ...task };
    if (taskData.dueDate && typeof taskData.dueDate === 'string') {
      taskData.dueDate = new Date(taskData.dueDate);
    }
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, this.getHttpOptions()).pipe(
      tap(() => {
        // Clear reminder flag when task is updated
        if (this.taskReminderService) {
          this.taskReminderService.clearSentReminder(id);
        }
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  markTaskAsCompleted(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {}, this.getHttpOptions()).pipe(
      tap(() => {
        // Clear reminder flag when task is completed
        if (this.taskReminderService) {
          this.taskReminderService.clearSentReminder(id);
        }
      })
    );
  }

  markTaskAsPending(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/pending`, {}, this.getHttpOptions()).pipe(
      tap(() => {
        // Clear reminder flag when task status changes
        if (this.taskReminderService) {
          this.taskReminderService.clearSentReminder(id);
        }
      })
    );
  }

  getPendingTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/pending`, this.getHttpOptions());
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/completed`, this.getHttpOptions());
  }

  sendTaskReminder(taskId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${taskId}/send-reminder`, {}, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
}