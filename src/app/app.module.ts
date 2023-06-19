import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateIncidentComponent } from './incidents/create-incident/create-incident.component';
import { ProcessIncidentComponent } from './incidents/process-incident/process-incident.component';
import { IncidentsMapComponent } from './incidents/incidents-map/incidents-map.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material/material.module';
import { initializeKeycloak } from './auth/keycloak-initializer';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    IncidentsMapComponent,
    CreateIncidentComponent,
    ProcessIncidentComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    KeycloakAngularModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
