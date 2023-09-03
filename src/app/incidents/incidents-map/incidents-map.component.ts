import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IncidentService } from '../incident.service';
import { Incident } from '../incident.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { GoogleMap } from '@angular/google-maps';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-incidents-map',
  templateUrl: './incidents-map.component.html',
  styleUrls: ['./incidents-map.component.css'],
})
export class IncidentsMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap)
  googleMap!: GoogleMap;

  incidents: Incident[] = [];
  center: google.maps.LatLngLiteral = { lat: 44.7721881, lng: 17.1908958 };
  zoom = 15;

  circleCenter: google.maps.LatLng | undefined = new google.maps.LatLng(
    44.7721881,
    17.1908958
  );
  radius: number | undefined = 0.040500334955132056;

  zoomSubscription!: Subscription;
  dragSubscription!: Subscription;

  constructor(
    private incidentService: IncidentService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.fetchIncidents();
  }

  ngAfterViewInit(): void {
    this.zoomSubscription = this.googleMap.zoomChanged.subscribe({
      next: () => {
        this.setCircleAndRadius();
        this.fetchIncidents();
      },
    });

    this.dragSubscription = this.googleMap.mapDragend.subscribe({
      next: () => {
        this.setCircleAndRadius();
        this.fetchIncidents();
      },
    });
  }

  private fetchIncidents() {
    this.incidentService
      .getIncidents(
        this.circleCenter?.lng(),
        this.circleCenter?.lat(),
        this.radius
      )
      .subscribe({
        next: (incidents: Incident[]) => {
          this.snackbarService.showSnackBar('Updated incidents');
          this.incidents = incidents;
        },
        error: () => {
          this.snackbarService.showSnackBar('Unable to get incidents!');
        },
      });
  }

  setCircleAndRadius() {
    this.circleCenter = this.googleMap.getCenter();
    this.radius = this.calculateRadius();
  }

  calculateRadius() {
    const bounds = this.googleMap.getBounds();
    const center = this.googleMap.getCenter();
    if (!bounds || !center) {
      return undefined;
    }

    return Math.sqrt(
      Math.pow(bounds.getNorthEast().lat() - center.lat(), 2) +
        Math.pow(bounds.getNorthEast().lng() - center.lng(), 2)
    );
  }

  ngOnDestroy(): void {
    this.zoomSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
  }
}
