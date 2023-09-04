import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IncidentParams, IncidentService } from '../incident.service';
import { Incident } from '../incident.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { GoogleMap } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { TypeService } from '../types/type.service';
import { Type } from '../types/type.model';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-incidents-map',
  templateUrl: './incidents-map.component.html',
  styleUrls: ['./incidents-map.component.css'],
})
export class IncidentsMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  incidents: Incident[] = [];
  types: Type[] = [];
  subtypes: Type[] = [];
  subtypesDisabled = true;
  selectedType: string | null = null;
  center: google.maps.LatLngLiteral = { lat: 44.7721881, lng: 17.1908958 };
  zoom = 15;
  mapWidth!: number;
  mapHeight!: number;

  circleCenter: google.maps.LatLng | undefined = new google.maps.LatLng(
    44.7721881,
    17.1908958
  );
  radius: number | undefined = 0.040500334955132056;

  zoomSubscription!: Subscription;
  dragSubscription!: Subscription;

  constructor(
    private incidentService: IncidentService,
    private typeService: TypeService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchIncidents({});
    this.fetchTypes();
    this.route.queryParams.subscribe((params) => this.fetchIncidents(params));
  }

  ngAfterViewInit(): void {
    this.zoomSubscription = this.googleMap.zoomChanged.subscribe({
      next: () => {
        this.setCircleAndRadius();
      },
    });

    this.dragSubscription = this.googleMap.mapDragend.subscribe({
      next: () => {
        this.setCircleAndRadius();
      },
    });
  }

  private fetchIncidents(params: IncidentParams) {
    this.incidentService.getIncidents(params).subscribe({
      next: (incidents: Incident[]) => {
        this.snackbarService.showSnackBar('Updated incidents');
        this.incidents = incidents;
        console.log(incidents);
      },
      error: () => {
        this.snackbarService.showSnackBar('Unable to get incidents!');
      },
    });
  }

  onTypeSelected(typeId: string) {
    this.updateQueryParam({ type: typeId });
    this.typeService.getSubtypes(typeId).subscribe({
      next: (subtypes: Type[]) => {
        this.subtypesDisabled = subtypes.length === 0;
        this.subtypes = subtypes;
      },
      error: () => {
        this.snackbarService.showSnackBar('Unable to get subtypes!');
      },
    });
  }

  onSubtypeSelected(subtypeId: string) {
    this.updateQueryParam({ type: subtypeId });
  }

  onPeriodChanged(period: String) {
    this.updateQueryParam({ period: period });
  }

  resetFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: null, period: null, lat: null, lng: null, radius: null },
      queryParamsHandling: 'merge',
    });
  }

  updateQueryParam(queryParams: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private fetchTypes() {
    this.typeService.getTypes().subscribe({
      next: (types: Type[]) => {
        this.types = types;
      },
      error: () => {
        this.snackbarService.showSnackBar('Unable to get types!');
      },
    });
  }

  setCircleAndRadius() {
    this.updateQueryParam({
      lat: this.googleMap.getCenter()?.lat(),
      lng: this.googleMap.getCenter()?.lng(),
      radius: this.calculateRadius(),
    });
  }

  calculateRadius() {
    const bounds = this.googleMap.getBounds();
    const mapCenter = this.googleMap.getCenter();
    if (!bounds || !mapCenter) {
      return undefined;
    }

    return Math.sqrt(
      Math.pow(bounds.getNorthEast().lat() - mapCenter.lat(), 2) +
        Math.pow(bounds.getNorthEast().lng() - mapCenter.lng(), 2)
    );
  }

  ngOnDestroy(): void {
    this.zoomSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
  }
}
