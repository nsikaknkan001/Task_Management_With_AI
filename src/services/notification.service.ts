import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  taskId?: number;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  constructor() {}

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      autoClose: notification.autoClose !== false // Default to true unless explicitly set to false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([newNotification, ...currentNotifications]);

    // Auto remove after 10 seconds if autoClose is enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 10000);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notifications.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}