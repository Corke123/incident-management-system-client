import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isUser = false;
  isModerator = false;
  userProfile!: KeycloakProfile;

  constructor(private keycloak: KeycloakService) {}

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
}
