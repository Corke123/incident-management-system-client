import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isUser = false;
  isModerator = false;

  constructor(private keycloak: KeycloakService) {}

  ngOnInit(): void {
    this.isUser = this.keycloak.isUserInRole('USER');
    this.isModerator = this.keycloak.isUserInRole('MODERATOR');
    console.log('Is user: ' + this.isUser);
    console.log('Is moderator: ' + this.isModerator);
  }
}
