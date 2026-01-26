import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TaskReminderService } from '../../services/task-reminder.service';
import { TaskService } from '../../services/task.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-notification></app-notification>
      
      <nav class="navbar">
        <div class="container">
          <div class="flex justify-between items-center py-4">
            <div class="navbar-brand">Task Manager</div>
            <div class="flex items-center gap-4">
              <span class="text-gray-600">{{ currentUser?.username }}</span>
              <button class="btn btn-secondary btn-sm" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container">
        <div class="flex justify-between items-center py-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p class="text-gray-600">Manage your tasks and roadmaps</p>
          </div>
          <button class="btn btn-primary" (click)="navigateToCreateTask()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Task
          </button>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="stats-card animate-scale-in">
            <div class="stats-number">{{ totalTasks }}</div>
            <div class="stats-label">Total Tasks</div>
          </div>
          <div class="stats-card animate-scale-in" style="animation-delay: 0.1s">
            <div class="stats-number text-warning-500">{{ pendingTasks.length }}</div>
            <div class="stats-label">Pending</div>
          </div>
          <div class="stats-card animate-scale-in" style="animation-delay: 0.2s">
            <div class="stats-number text-success-500">{{ completedTasks.length }}</div>
            <div class="stats-label">Completed</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">Pending Tasks</h2>
              <span class="badge badge-warning">{{ pendingTasks.length }}</span>
            </div>
            
            <div class="space-y-4 max-h-[70vh] overflow-y-auto">
              <div *ngIf="pendingTasks.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No pending tasks</h3>
                <p class="text-gray-600">Create your first task to get started!</p>
              </div>
              
              <div 
                *ngFor="let task of pendingTasks; trackBy: trackByTaskId" 
                class="task-card animate-fade-in"
                [class.priority-high]="task.priority === 'HIGH'"
                [class.priority-medium]="task.priority === 'MEDIUM'"
                [class.priority-low]="task.priority === 'LOW'"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 flex-1 mr-4">{{ task.title }}</h3>
                  <span class="priority-badge" [class]="task.priority.toLowerCase()">
                    {{ task.priority }}
                  </span>
                </div>
                
                <p class="text-gray-600 mb-4 line-clamp-2">{{ task.description }}</p>
                
                <div *ngIf="task.roadmap" class="mb-4">
                  <div class="flex gap-2 mb-2">
                    <button 
                      class="btn btn-outline btn-sm"
                      (click)="toggleRoadmap(task.id!)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ isRoadmapExpanded(task.id!) ? 'Hide' : 'Show' }}
                    </button>
                    <button 
                      class="btn btn-primary btn-sm"
                      (click)="viewFullRoadmap(task.id!)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                  </div>
                  <div 
                    class="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 transition-all duration-300"
                    [class.hidden]="!isRoadmapExpanded(task.id!)"
                  >
                    <pre class="whitespace-pre-wrap">{{ task.roadmap | slice:0:200 }}{{ task.roadmap.length > 200 ? '...' : '' }}</pre>
                  </div>
                </div>
                
                <div class="flex flex-col gap-2 mb-4 text-sm text-gray-500">
                  <div *ngIf="task.dueDate" class="flex items-center gap-2" 
                       [class.text-error-500]="isOverdue(task)" 
                       [class.text-warning-500]="isDueSoon(task)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Due: {{ task.dueDate | date:'MMM d, y h:mm a' }}
                    <span *ngIf="isDueSoon(task)" class="text-warning-500 font-medium">⚠️ Due Soon!</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ task.createdAt | date:'short' }}
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <button 
                    class="btn btn-outline btn-sm" 
                    (click)="markAsCompleted(task.id!)"
                    [disabled]="isLoading"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Complete
                  </button>
                  <button 
                    class="btn btn-secondary btn-sm" 
                    (click)="editTask(task.id!)"
                    [disabled]="isLoading"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button 
                    class="btn btn-outline btn-sm text-error-500 border-error-500 hover:bg-error-50" 
                    (click)="deleteTask(task.id!)"
                    [disabled]="isLoading"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">Completed Tasks</h2>
              <span class="badge badge-success">{{ completedTasks.length }}</span>
            </div>
            
            <div class="space-y-4 max-h-[70vh] overflow-y-auto">
              <div *ngIf="completedTasks.length === 0" class="text-center py-12">
                <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No completed tasks</h3>
                <p class="text-gray-600">Completed tasks will appear here.</p>
              </div>
              
              <div 
                *ngFor="let task of completedTasks; trackBy: trackByTaskId" 
                class="task-card completed animate-fade-in"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 flex-1 mr-4">{{ task.title }}</h3>
                  <span class="priority-badge completed">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    COMPLETED
                  </span>
                </div>
                
                <p class="text-gray-600 mb-4 line-clamp-2">{{ task.description }}</p>
                
                <div *ngIf="task.roadmap" class="mb-4">
                  <button 
                    class="btn btn-primary btn-sm"
                    (click)="viewFullRoadmap(task.id!)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Roadmap
                  </button>
                </div>
                
                <div class="flex flex-col gap-2 mb-4 text-sm text-gray-500">
                  <div *ngIf="task.dueDate" class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {{ task.dueDate | date:'MMM d, y h:mm a' }}
                  </div>
                  <div class="flex items-center gap-2 text-success-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ task.updatedAt | date:'short' }}
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <button 
                    class="btn btn-outline btn-sm" 
                    (click)="markAsPending(task.id!)"
                    [disabled]="isLoading"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                    Reopen
                  </button>
                  <button 
                    class="btn btn-outline btn-sm text-error-500 border-error-500 hover:bg-error-50" 
                    (click)="deleteTask(task.id!)"
                    [disabled]="isLoading"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  tasks: Task[] = [];
  pendingTasks: Task[] = [];
  completedTasks: Task[] = [];
  totalTasks = 0;
  isLoading = false;
  expandedRoadmaps = new Set<number>();

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private notificationService: NotificationService,
    private taskReminderService: TaskReminderService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTasks();
    
    // Subscribe to real-time task updates from reminder service
    this.taskReminderService.tasks$.subscribe(tasks => {
      if (tasks.length > 0) {
        this.updateTasksFromRealTime(tasks);
      }
    });
    
    // Start the reminder service if not already running
    if (this.authService.isAuthenticated()) {
      this.taskReminderService.startReminderService();
      
      // Force a reminder check when dashboard loads
      setTimeout(() => {
        this.taskReminderService.forceReminderCheck();
      }, 2000);
    }
  }

  private updateTasksFromRealTime(realtimeTasks: Task[]): void {
    // Update pending tasks with real-time data
    this.pendingTasks = realtimeTasks;
    
    // Reload all tasks to get complete picture
    this.taskService.getAllTasks().subscribe({
      next: (allTasks) => {
        this.tasks = allTasks;
        this.completedTasks = allTasks.filter(task => task.status === 'COMPLETED');
        this.totalTasks = allTasks.length;
      },
      error: (error) => {
        console.error('Error updating tasks from real-time:', error);
      }
    });
  }
  trackByTaskId(index: number, task: Task): number {
    return task.id || index;
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.pendingTasks = tasks.filter(task => task.status === 'PENDING');
        this.completedTasks = tasks.filter(task => task.status === 'COMPLETED');
        this.totalTasks = tasks.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      }
    });
  }

  navigateToCreateTask() {
    this.router.navigate(['/create-task']);
  }

  editTask(taskId: number) {
    this.router.navigate(['/edit-task', taskId]);
  }

  viewFullRoadmap(taskId: number) {
    this.router.navigate(['/roadmap', taskId]);
  }

  toggleRoadmap(taskId: number) {
    if (this.expandedRoadmaps.has(taskId)) {
      this.expandedRoadmaps.delete(taskId);
    } else {
      this.expandedRoadmaps.add(taskId);
    }
  }

  isRoadmapExpanded(taskId: number): boolean {
    return this.expandedRoadmaps.has(taskId);
  }

  isDueSoon(task: Task): boolean {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (dueDate.getTime() - now.getTime()) <= twentyFourHours && dueDate.getTime() > now.getTime();
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate.getTime() < now.getTime();
  }

  markAsCompleted(taskId: number) {
    this.isLoading = true;
    this.taskService.markTaskAsCompleted(taskId).subscribe({
      next: (updatedTask) => {
        this.isLoading = false;
        this.loadTasks(); // Refresh tasks to get current state
        this.notificationService.addNotification({
          title: 'Task Completed',
          message: `"${updatedTask.title}" has been marked as completed!`,
          type: 'success'
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error marking task as completed:', error);
        this.notificationService.addNotification({
          title: 'Error',
          message: 'Failed to mark task as completed',
          type: 'error'
        });
      }
    });
  }

  markAsPending(taskId: number) {
    this.isLoading = true;
    this.taskService.markTaskAsPending(taskId).subscribe({
      next: (updatedTask) => {
        this.isLoading = false;
        this.loadTasks(); // Refresh tasks to get current state
        this.notificationService.addNotification({
          title: 'Task Reopened',
          message: `"${updatedTask.title}" has been reopened!`,
          type: 'info'
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error marking task as pending:', error);
        this.notificationService.addNotification({
          title: 'Error',
          message: 'Failed to reopen task',
          type: 'error'
        });
      }
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isLoading = true;
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadTasks(); // Refresh tasks to get current state
          this.notificationService.addNotification({
            title: 'Task Deleted',
            message: 'Task has been successfully deleted',
            type: 'info'
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error deleting task:', error);
          this.notificationService.addNotification({
            title: 'Error',
            message: 'Failed to delete task',
            type: 'error'
          });
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
