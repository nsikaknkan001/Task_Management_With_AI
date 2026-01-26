import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, interval, switchMap } from 'rxjs';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskReminderService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private reminderInterval = 30000; // Check every 30 seconds for real-time updates
  private sentReminders = new Set<number>(); // Track tasks that already had reminders sent
  private isServiceRunning = false;
  private intervalSubscription: any;
  
  // Real-time task updates
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    // Register this service with task service to avoid circular dependency
    this.taskService.setTaskReminderService(this);
  }

  startReminderService(): void {
    // Only start if user is authenticated and service isn't already running
    if (!this.authService.isAuthenticated() || this.isServiceRunning) {
      return;
    }

    this.isServiceRunning = true;
    console.log('🔔 Real-time task reminder service started');

    // Initial check
    this.checkTasksForReminders();

    // Set up interval checks for real-time updates
    this.intervalSubscription = interval(this.reminderInterval) // Check every 30 seconds
      .pipe(
        filter(() => this.authService.isAuthenticated()),
        switchMap(() => this.taskService.getPendingTasks())
      )
      .subscribe({
        next: (tasks) => {
          console.log(`📋 Real-time check: ${tasks.length} pending tasks`);
          this.tasksSubject.next(tasks); // Update real-time tasks
          this.checkTasksForReminders(tasks);
        },
        error: (error) => {
          console.error('❌ Error in real-time task checking:', error);
        }
      });
  }

  stopReminderService(): void {
    this.isServiceRunning = false;
    this.sentReminders.clear();
    
    // Unsubscribe from interval
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
    
    console.log('🛑 Task reminder service stopped');
  }

  private checkTasksForReminders(tasks?: Task[]): void {
    if (!tasks) {
      this.taskService.getPendingTasks().subscribe({
        next: (pendingTasks) => {
          this.processTaskReminders(pendingTasks);
        },
        error: (error) => {
          console.error('❌ Error loading tasks for reminders:', error);
        }
      });
    } else {
      this.processTaskReminders(tasks);
    }
  }

  private processTaskReminders(tasks: Task[]): void {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let remindersProcessed = 0;

    tasks.forEach(task => {
      if (task.dueDate && task.id && !task.reminderSent && !this.sentReminders.has(task.id)) {
        const dueDate = new Date(task.dueDate);
        
        // Check if task is due within 24 hours and not overdue
        if (dueDate <= twentyFourHoursFromNow && dueDate > now) {
          const timeUntilDue = dueDate.getTime() - now.getTime();
          const hoursUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60));
          const minutesUntilDue = Math.ceil(timeUntilDue / (1000 * 60));
          
          let urgencyLevel: 'low' | 'medium' | 'high' = 'low';
          let notificationTitle = '';
          let notificationMessage = '';

          if (minutesUntilDue <= 60) {
            urgencyLevel = 'high';
            notificationTitle = '🚨 CRITICAL: Task Due in 1 Hour!';
            notificationMessage = `"${task.title}" is due in ${minutesUntilDue} minute(s)! Email reminder sent.`;
          } else if (hoursUntilDue <= 6) {
            urgencyLevel = 'high';
            notificationTitle = '⚠️ URGENT: Task Due Soon!';
            notificationMessage = `"${task.title}" is due in ${hoursUntilDue} hour(s). Email reminder sent.`;
          } else if (hoursUntilDue <= 12) {
            urgencyLevel = 'medium';
            notificationTitle = '📋 Task Reminder';
            notificationMessage = `"${task.title}" is due in ${hoursUntilDue} hour(s). Email reminder sent.`;
          } else {
            urgencyLevel = 'low';
            notificationTitle = '📅 Upcoming Task';
            notificationMessage = `"${task.title}" is due in ${hoursUntilDue} hour(s). Email reminder sent.`;
          }

          // Show browser notification
          this.showBrowserNotification(notificationTitle, notificationMessage, urgencyLevel);

          // Show in-app notification
          this.notificationService.addNotification({
            title: notificationTitle,
            message: notificationMessage,
            type: urgencyLevel === 'high' ? 'error' : urgencyLevel === 'medium' ? 'warning' : 'info',
            taskId: task.id,
            autoClose: urgencyLevel !== 'high' // Keep high priority notifications open
          });

          // Send email reminder
          this.sendEmailReminder(task, hoursUntilDue);
          
          // Mark as reminder sent to avoid duplicates in this session
          this.sentReminders.add(task.id);
          remindersProcessed++;

          console.log(`📧 Processed reminder for task: "${task.title}" (Due in ${hoursUntilDue}h)`);
        }
      }
    });

    if (remindersProcessed > 0) {
      console.log(`✅ Processed ${remindersProcessed} task reminders`);
    }
  }

  private showBrowserNotification(title: string, message: string, urgency: 'low' | 'medium' | 'high'): void {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const options: NotificationOptions = {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          requireInteraction: urgency === 'high',
          tag: 'task-reminder'
        };

        // Add vibrate only if supported (mobile devices)
        if ('vibrate' in navigator) {
          (options as any).vibrate = urgency === 'high' ? [200, 100, 200] : [100];
        }

        const notification = new Notification(title, options);
        
        // Auto close after 15 seconds for low/medium urgency
        if (urgency !== 'high') {
          setTimeout(() => notification.close(), 15000);
        }

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.showBrowserNotification(title, message, urgency);
          }
        });
      }
    }
  }

  private sendEmailReminder(task: Task, hoursUntilDue: number): void {
    const reminderData = {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      dueDate: task.dueDate,
      hoursUntilDue: hoursUntilDue
    };

    this.http.post(`${this.apiUrl}/send-reminder`, reminderData, this.getHttpOptions())
      .subscribe({
        next: () => {
          console.log(`📧 Email reminder sent successfully for task: "${task.title}"`);
        },
        error: (error) => {
          console.error(`❌ Failed to send email reminder for task: "${task.title}"`, error);
        }
      });
  }

  public sendManualReminder(taskId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/send-reminder`, {}, this.getHttpOptions());
  }

  public requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('🔔 Browser notifications enabled');
        } else {
          console.log('🔕 Browser notifications denied');
        }
      });
    }
  }

  // Method to force refresh tasks and check reminders
  public forceReminderCheck(): void {
    console.log('🔄 Force checking task reminders...');
    this.checkTasksForReminders();
  }

  // Method to clear sent reminders when tasks are updated
  public clearSentReminder(taskId: number): void {
    this.sentReminders.delete(taskId);
    console.log(`🔄 Cleared reminder flag for task ID: ${taskId}`);
  }

  // Method to clear all sent reminders
  public clearAllSentReminders(): void {
    this.sentReminders.clear();
    console.log('🔄 Cleared all reminder flags');
  }

  // Get real-time tasks
  public getCurrentTasks(): Task[] {
    return this.tasksSubject.value;
  }

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  }
}