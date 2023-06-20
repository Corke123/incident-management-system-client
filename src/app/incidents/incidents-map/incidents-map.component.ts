import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../incident.service';
import { Incident } from '../incident.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateIncidentDialogComponent } from '../create-incident-dialog/create-incident-dialog.component';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-incidents-map',
  templateUrl: './incidents-map.component.html',
  styleUrls: ['./incidents-map.component.css'],
})
export class IncidentsMapComponent implements OnInit {
  incidents: Incident[] = [];
  isLoggedIn = false;

  constructor(
    private incidentService: IncidentService,
    private keycloakService: KeycloakService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.keycloakService
      .isLoggedIn()
      .then((result) => (this.isLoggedIn = result));
    this.incidentService.getIncidents().subscribe({
      next: (incidents: Incident[]) => {
        this.incidents = incidents;
        console.log(incidents);
      },
      error: () => {
        console.log('Unable to get incidents');
      },
    });
  }

  onCreateIncident(): void {
    const dialogRef = this.dialog.open(CreateIncidentDialogComponent, {
      width: '1100px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.incidents.push(result);
      }
    });
  }
}
