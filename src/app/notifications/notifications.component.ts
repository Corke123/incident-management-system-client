import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[];

  constructor(private notificationService: NotificationService) {
    this.notifications = [...notificationService.notifications];
  }

  ngOnInit(): void {
    this.notificationService.notificationSubject.subscribe((message) => {
      this.notifications.push(message);
    });
  }

  ngOnDestroy(): void {
    this.notificationService.notificationSubject.unsubscribe();
  }
}
