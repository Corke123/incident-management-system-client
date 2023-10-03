import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { NotificationService } from '../notifications/notification.service';
import { Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isUser = false;
  isModerator = false;
  userProfile!: KeycloakProfile;
  notificationsCount = 0;

  constructor(
    private keycloak: KeycloakService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.keycloak
      .isLoggedIn()
      .then((value) => {
        this.isLoggedIn = value;
      })
      .then(() => {
        if (this.isLoggedIn) {
          this.getUserInfo();
        }
      });
    this.isUser = this.keycloak.isUserInRole('USER');
    this.isModerator = this.keycloak.isUserInRole('MODERATOR');

    this.notificationService.notificationSubject.subscribe((message) => {
      this.notificationsCount++;
      this.notificationService.notifications.push(message);
    });
  }

  onLogin() {
    this.keycloak
      .login()
      .then(() => {
        return this.keycloak.loadUserProfile();
      })
      .then((keycloakProfile: KeycloakProfile) => {
        this.userProfile = keycloakProfile;
      });
  }

  onLogout() {
    this.keycloak.logout();
  }

  getUserInfo() {
    this.keycloak.loadUserProfile().then((keycloakProfile: KeycloakProfile) => {
      this.userProfile = keycloakProfile;
    });
  }

  onNotificationsClick() {
    this.notificationsCount = 0;
    this.router.navigate(['notifications']);
  }

  ngOnDestroy() {
    this.notificationService.notificationSubject.unsubscribe();
  }
}
