import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../incident.service';
import { Incident } from '../incident.model';

@Component({
  selector: 'app-incidents-map',
  templateUrl: './incidents-map.component.html',
  styleUrls: ['./incidents-map.component.css'],
})
export class IncidentsMapComponent implements OnInit {
  incidents: Incident[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
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
}
