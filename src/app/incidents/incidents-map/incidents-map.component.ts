import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../incident.service';
import { Incident } from '../incident.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-incidents-map',
  templateUrl: './incidents-map.component.html',
  styleUrls: ['./incidents-map.component.css'],
})
export class IncidentsMapComponent implements OnInit {
  incidents: Incident[] = [];
  center: google.maps.LatLngLiteral = { lat: 44.7721881, lng: 17.1908958 };
  zoom = 15;

  constructor(
    private incidentService: IncidentService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe({
      next: (incidents: Incident[]) => {
        this.incidents = incidents;
      },
      error: () => {
        this.snackbarService.showSnackBar('Unable to get incidents!');
      },
    });
  }
}
