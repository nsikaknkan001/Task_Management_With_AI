import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { AIRoadmapService } from '../../services/ai-roadmap.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TaskService } from '../../services/task.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
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
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center gap-4 py-8">
            <button class="btn btn-outline" (click)="goBack()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
              <p class="text-gray-600">Update your task and roadmap</p>
            </div>
          </div>

          <div *ngIf="isLoading && !taskData" class="text-center py-12">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-gray-600">Loading task...</p>
          </div>

          <div *ngIf="taskData" class="card">
            <div class="card-body">
              <form #taskForm="ngForm" (ngSubmit)="onSubmit(taskForm)" class="space-y-6">
                <div *ngIf="errorMessage" class="alert alert-error">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ errorMessage }}
                </div>

                <div class="form-group">
                  <label for="title" class="form-label required">Task Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    class="form-input"
                    [class.error]="hasFieldError('title')"
                    [(ngModel)]="taskData.title"
                    #title="ngModel"
                    required
                    maxlength="200"
                    placeholder="Enter a clear, descriptive title for your task"
                  />
                  <div *ngIf="hasFieldError('title')" class="form-error-messages">
                    <div *ngFor="let error of getFieldErrors('title')" class="form-error">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="description" class="form-label required">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    class="form-textarea"
                    [class.error]="hasFieldError('description')"
                    [(ngModel)]="taskData.description"
                    #description="ngModel"
                    required
                    maxlength="1000"
                    rows="4"
                    placeholder="Provide detailed information about what needs to be accomplished"
                  ></textarea>
                  <div *ngIf="hasFieldError('description')" class="form-error-messages">
                    <div *ngFor="let error of getFieldErrors('description')" class="form-error">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div class="form-group">
                    <label for="priority" class="form-label">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      class="form-select"
                      [(ngModel)]="taskData.priority"
                    >
                      <option value="LOW">Low Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="HIGH">High Priority</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="dueDate" class="form-label">Due Date (Optional)</label>
                    <input
                      type="datetime-local"
                      id="dueDate"
                      name="dueDate"
                      class="form-input"
                      [class.error]="hasFieldError('dueDate')"
                      [(ngModel)]="taskData.dueDate"
                      [min]="minDate"
                    />
                    <div *ngIf="hasFieldError('dueDate')" class="form-error-messages">
                      <div *ngFor="let error of getFieldErrors('dueDate')" class="form-error">
                        {{ error }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="roadmap" class="form-label">AI-Generated Roadmap</label>
                  <div class="flex gap-3 mb-4">
                    <button
                      type="button"
                      class="btn btn-primary"
                      (click)="generateRoadmap()"
                      [disabled]="isGeneratingRoadmap"
                    >
                      <span *ngIf="isGeneratingRoadmap" class="spinner"></span>
                      {{ isGeneratingRoadmap ? 'Generating...' : 'Generate Roadmap' }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline"
                      (click)="clearRoadmap()"
                      [disabled]="!taskData.roadmap || isGeneratingRoadmap"
                    >
                      Clear Roadmap
                    </button>
                  </div>
                  
                  <div *ngIf="taskData.roadmap" class="bg-gray-50 rounded-lg p-4 border">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-semibold text-gray-900">Generated Roadmap</h4>
                      <span class="text-sm text-gray-500">{{ taskData.roadmap.length }} characters</span>
                    </div>
                    <div class="max-w-none">
                      <pre class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{{ taskData.roadmap }}</pre>
                    </div>
                  </div>
                  
                  <div *ngIf="!taskData.roadmap && !isGeneratingRoadmap" class="text-center py-8 text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <p>No roadmap generated yet</p>
                    <p class="text-xs">Fill in the title and description, then click "Generate Roadmap"</p>
                  </div>
                </div>

                <div *ngIf="successMessage" class="alert alert-success">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ successMessage }}
                </div>

                <div class="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="goBack()"
                    [disabled]="isLoading"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner"></span>
                    {{ isLoading ? 'Updating...' : 'Update Task' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div *ngIf="!taskData && !isLoading" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Task not found</h3>
            <p class="text-gray-600">The task you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EditTaskComponent implements OnInit {
  currentUser: User | null = null;
  taskData: Task | null = null;
  taskId: number = 0;
  isLoading = false;
  isGeneratingRoadmap = false;
  errorMessage = '';
  successMessage = '';
  minDate = '';
  
  // Validation state
  validationErrors: { [key: string]: string[] } = {};

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private aiRoadmapService: AIRoadmapService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.setMinDate();
    this.loadTask();
  }

  setMinDate() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDate = now.toISOString().slice(0, 16);
  }

  validateTaskForm(): boolean {
    this.validationErrors = {};
    
    if (!this.taskData?.title?.trim()) {
      this.validationErrors['title'] = ['Task title is required'];
    } else if (this.taskData.title.trim().length < 3) {
      this.validationErrors['title'] = ['Title must be at least 3 characters long'];
    } else if (this.taskData.title.length > 200) {
      this.validationErrors['title'] = ['Title must be less than 200 characters'];
    }

    if (!this.taskData?.description?.trim()) {
      this.validationErrors['description'] = ['Task description is required'];
    } else if (this.taskData.description.trim().length < 10) {
      this.validationErrors['description'] = ['Description must be at least 10 characters long'];
    } else if (this.taskData.description.length > 1000) {
      this.validationErrors['description'] = ['Description must be less than 1000 characters'];
    }

    // Validate due date if provided
    if (this.taskData?.dueDate) {
      const dueDate = new Date(this.taskData.dueDate);
      const now = new Date();
      if (dueDate <= now) {
        this.validationErrors['dueDate'] = ['Due date must be in the future'];
      }
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  hasFieldError(fieldName: string): boolean {
    return this.validationErrors[fieldName] && this.validationErrors[fieldName].length > 0;
  }

  getFieldErrors(fieldName: string): string[] {
    return this.validationErrors[fieldName] || [];
  }

  loadTask() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = parseInt(id, 10);
      this.isLoading = true;
      
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.taskData = task;
          if (this.taskData.dueDate) {
            const dueDate = new Date(this.taskData.dueDate);
            // Convert to local datetime-local format
            const localDate = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000);
            this.taskData.dueDate = localDate.toISOString().slice(0, 16) as any;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading task:', error);
          this.errorMessage = 'Failed to load task.';
          this.isLoading = false;
        }
      });
    }
  }

  generateRoadmap() {
    if (!this.validateTaskForm()) {
      this.errorMessage = 'Please fix the form errors before generating a roadmap.';
      return;
    }

    this.isGeneratingRoadmap = true;
    this.errorMessage = '';

    this.aiRoadmapService.generateRoadmap({ 
      title: this.taskData!.title!, 
      description: this.taskData!.description!, 
      priority: this.taskData!.priority! 
    }).subscribe({
      next: (response) => {
        if (this.taskData) {
          this.taskData.roadmap = response.roadmap;
        }
        this.isGeneratingRoadmap = false;
        this.notificationService.addNotification({ 
          title: 'Success', 
          message: 'AI roadmap generated successfully!', 
          type: 'success' 
        });
      },
      error: (error) => {
        console.error('Error generating roadmap:', error);
        this.errorMessage = 'Failed to generate roadmap. Please try again.';
        this.isGeneratingRoadmap = false;
      }
    });
  }

  clearRoadmap() {
    if (this.taskData) {
      this.taskData.roadmap = '';
    }
  }

  onSubmit(form: NgForm) {
    if (!this.validateTaskForm()) {
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    if (this.taskData) {
      this.isLoading = true;
      this.errorMessage = '';

      const taskToUpdate: Partial<Task> = {
        ...this.taskData,
        dueDate: this.taskData.dueDate || undefined
      };

      this.taskService.updateTask(this.taskId, taskToUpdate).subscribe({
        next: (task) => {
          this.isLoading = false;
          this.successMessage = 'Task updated successfully!';
          this.notificationService.addNotification({ 
            title: 'Success', 
            message: 'Task updated successfully!', 
            type: 'success' 
          });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.errorMessage = error.error?.message || 'Failed to update task. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}