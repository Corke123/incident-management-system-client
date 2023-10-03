import { Component, OnInit } from '@angular/core';
import { Type } from '../types/type.model';
import { TypeService } from '../types/type.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from '../incident.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-incident',
  templateUrl: './create-incident.component.html',
  styleUrls: ['./create-incident.component.css'],
})
export class CreateIncidentComponent implements OnInit {
  types: Type[] = [];
  subtypes: Type[] = [];
  subtypesEnabled = false;
  url = '';
  lat = 44.7721881;
  lng = 17.1908958;
  center: google.maps.LatLngLiteral = { lat: 44.7721881, lng: 17.1908958 };
  zoom = 15;

  incidentForm = new FormGroup({
    description: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(2048),
    ]),
    longitude: new FormControl<number | null>(null, [
      (Validators.min(-90), Validators.max(90)),
    ]),
    latitude: new FormControl<number | null>(null, [
      (Validators.min(-180), Validators.max(180)),
    ]),
    typeId: new FormControl<string | null>(null, Validators.required),
    subtypeId: new FormControl<string | null>({ value: null, disabled: true }),
    image: new FormControl<File | null>(null, Validators.required),
  });

  constructor(
    private typeService: TypeService,
    private incidentService: IncidentService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.typeService.getTypes().subscribe({
      next: (types: Type[]) => {
        this.types = types;
      },
      error: () => {
        this.snackbarService.showSnackBar('Unable to get types!');
      },
    });
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.setIncidentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        },
        () => {
          this.snackbarService.showSnackBar('Unable to load current position');
        }
      );
    } else {
      this.snackbarService.showSnackBar(
        'Geolocation is not supported by this browser.'
      );
    }
  }

  onTypeSelected(typeId: string) {
    this.typeService.getSubtypes(typeId).subscribe({
      next: (subtypes: Type[]) => {
        if (subtypes.length !== 0) {
          this.incidentForm.get('subtypeId')?.enable();
        } else {
          this.incidentForm.get('subtypeId')?.disable();
        }
        this.subtypes = subtypes;
      },
      error: () => {
        this.snackbarService.showSnackBar('Unable to get subtypes!');
      },
    });
  }

  onFileSelected(event: any) {
    if (event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      this.incidentForm.controls['image'].patchValue(
        <File>event.target.files[0]
      );
    }
  }

  addMarker(latLng: any) {
    this.setIncidentLocation({
      latitude: latLng.lat(),
      longitude: latLng.lng(),
    });
  }

  setIncidentLocation(position: { latitude: number; longitude: number }) {
    this.lat = position.latitude;
    this.lng = position.longitude;
    this.incidentForm.controls['latitude'].patchValue(position.latitude);
    this.incidentForm.controls['longitude'].patchValue(position.longitude);
  }

  onSubmit() {
    if (!this.incidentForm.valid) {
      return;
    }

    const incidentRequest = {
      description: this.incidentForm.value.description!,
      latitude: this.incidentForm.value.latitude!,
      longitude: this.incidentForm.value.longitude!,
      typeId: this.incidentForm.value.subtypeId
        ? this.incidentForm.value.subtypeId
        : this.incidentForm.value.typeId!,
    };
    const image = this.incidentForm.value.image!;
    this.incidentService.uploadIncident(incidentRequest, image).subscribe({
      next: (createdIncident) => {
        this.snackbarService.showSnackBar('Successfully created a new incident');
        this.router.navigate(['incidents']);
      },
      error: (error) => {
        this.snackbarService.showSnackBar('Error occured');
      },
    });
  }
}
