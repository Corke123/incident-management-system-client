import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentsMapComponent } from './incidents/incidents-map/incidents-map.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { CreateIncidentComponent } from './incidents/create-incident/create-incident.component';
import { IncidentDetailComponent } from './incidents/incident-detail/incident-detail.component';
import { PageNotFoundComponent } from './incidents/page-not-found/page-not-found.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: 'incidents',
    component: IncidentsMapComponent,
  },
  {
    path: 'incidents/not-found',
    component: PageNotFoundComponent,
  },
  {
    path: 'incidents/:id',
    component: IncidentDetailComponent,
  },
  {
    path: 'create-incident',
    component: CreateIncidentComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: ['USER'],
    },
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
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
