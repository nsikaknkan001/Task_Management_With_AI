import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification-item"
        [class]="'notification-' + notification.type"
      >
        <div class="notification-content">
          <div class="notification-header">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <button 
              class="notification-close"
              (click)="removeNotification(notification.id)"
            >
              ×
            </button>
          </div>
          <p class="notification-message">{{ notification.message }}</p>
          <div class="notification-time">
            {{ notification.timestamp | date:'short' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }

    .notification-item {
      background: rgba(30, 30, 30, 0.95);
      border-radius: 12px;
      margin-bottom: 10px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideInFromTop 0.3s ease-out;
      border-left: 4px solid;
    }

    .notification-warning {
      border-left-color: #ffc107;
    }

    .notification-error {
      border-left-color: #dc3545;
    }

    .notification-success {
      border-left-color: #28a745;
    }

    .notification-info {
      border-left-color: #17a2b8;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .notification-title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      flex: 1;
    }

    .notification-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .notification-close:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .notification-message {
      color: #e0e0e0;
      font-size: 14px;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .notification-time {
      color: #999;
      font-size: 12px;
    }

    @keyframes slideInFromTop {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notification-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }
}