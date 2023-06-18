import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentsMapComponent } from './incidents/incidents-map/incidents-map.component';
import { CreateIncidentComponent } from './incidents/create-incident/create-incident.component';
import { ProcessIncidentComponent } from './incidents/process-incident/process-incident.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'incidents',
    component: IncidentsMapComponent,
  },
  {
    path: 'new-incident',
    component: CreateIncidentComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: ['USER'],
    },
  },
  {
    path: 'process-incident',
    component: ProcessIncidentComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: ['MODERATOR'],
    },
  },
  { path: '', redirectTo: '/incidents', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
