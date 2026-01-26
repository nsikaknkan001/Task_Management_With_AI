import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { RoadmapViewerComponent } from './components/roadmap-viewer/roadmap-viewer.component';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { TaskReminderService } from './services/task-reminder.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class App {
  constructor(private taskReminderService: TaskReminderService) {
    // Initialize task reminder service
    this.taskReminderService.requestNotificationPermission();
    
    // Start reminder service after a short delay to ensure proper initialization
    setTimeout(() => {
      this.taskReminderService.startReminderService();
    }, 1000);
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' as const },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create-task', component: CreateTaskComponent, canActivate: [AuthGuard] },
  { path: 'edit-task/:id', component: EditTaskComponent, canActivate: [AuthGuard] },
  { path: 'roadmap/:id', component: RoadmapViewerComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/auth' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    importProvidersFrom(BrowserAnimationsModule)
  ]
}).catch(err => console.error(err));