import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IncidentsMapComponent } from './incidents/incidents-map/incidents-map.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material/material.module';
import { initializeKeycloak } from './auth/keycloak-initializer';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CreateIncidentComponent } from './incidents/create-incident/create-incident.component';
import { IncidentDetailComponent } from './incidents/incident-detail/incident-detail.component';
import { PageNotFoundComponent } from './incidents/page-not-found/page-not-found.component';
import { StatusComponent } from './status/status.component';
import {
  IMAGE_LOADER,
  NgOptimizedImage,
  provideCloudinaryLoader,
} from '@angular/common';
import { environment } from 'src/environments/environment.development';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    IncidentsMapComponent,
    HeaderComponent,
    CreateIncidentComponent,
    IncidentDetailComponent,
    PageNotFoundComponent,
    StatusComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientJsonpModule,
    NgOptimizedImage,
    HttpClientModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    GoogleMapsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    provideCloudinaryLoader(
      `https://res.cloudinary.com/${environment.cloudinaryCloudName}`
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
