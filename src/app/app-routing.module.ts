import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentsMapComponent } from './incidents/incidents-map/incidents-map.component';
import { CreateIncidentComponent } from './incidents/create-incident/create-incident.component';
import { ProcessIncidentComponent } from './incidents/process-incident/process-incident.component';

const routes: Routes = [
  {
    path: 'incidents',
    component: IncidentsMapComponent,
  },
  {
    path: 'new-incident',
    component: CreateIncidentComponent,
  },
  {
    path: 'process-incident',
    component: ProcessIncidentComponent,
  },
  { path: '', redirectTo: '/incidents', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
