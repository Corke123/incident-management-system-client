import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateIncidentComponent } from './incidents/create-incident/create-incident.component';
import { ProcessIncidentComponent } from './incidents/process-incident/process-incident.component';
import { IncidentsMapComponent } from './incidents/incidents-map/incidents-map.component';

@NgModule({
  declarations: [
    AppComponent,
    IncidentsMapComponent,
    CreateIncidentComponent,
    ProcessIncidentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
