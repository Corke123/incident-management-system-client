import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { Notification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notificationSubject: Subject<Notification>;
  public notifications: Notification[] = [];

  constructor() {
    if (!this.notificationSubject) {
      this.notificationSubject = webSocket(
        'ws://localhost:8085/ws/notifications'
      );
    }
  }
}
