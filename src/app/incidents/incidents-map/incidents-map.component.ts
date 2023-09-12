import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IncidentParams, IncidentService } from '../incident.service';
import { Incident } from '../incident.model';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { GoogleMap } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { TypeService } from '../types/type.service';
import { Type } from '../types/type.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

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
  selectedStatus: string | null = null;
  selectedType: string | null = null;
  selectedSubType: string | null = null;
  selectedPeriod: string | null = null;
  center: google.maps.LatLngLiteral = { lat: 44.7721881, lng: 17.1908958 };
  zoom = 15;
  mapWidth!: number;
  mapHeight!: number;
  isModerator = false;

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
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    this.isModerator = this.keycloak.isUserInRole('MODERATOR');
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

  onStatusSelected(status: string) {
    this.selectedStatus = status;
    this.updateQueryParam({ status: status });
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
    this.selectedPeriod = this.selectedPeriod;
    this.updateQueryParam({ period: period });
  }

  resetFilters() {
    this.selectedStatus = null;
    this.selectedType = null;
    this.selectedSubType = null;
    this.selectedPeriod = null;
    this.subtypesDisabled = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: null,
        type: null,
        period: null,
        lat: null,
        lng: null,
        radius: null,
      },
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

    return google.maps.geometry.spherical.computeDistanceBetween(
      bounds.getNorthEast(),
      mapCenter
    );
  }

  ngOnDestroy(): void {
    this.zoomSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
  }
}
