import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from '../incident.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-create-incident-dialog',
  templateUrl: './create-incident-dialog.component.html',
  styleUrls: ['./create-incident-dialog.component.css'],
})
export class CreateIncidentDialogComponent implements OnInit {
  url = '';
  selectedFile!: File;
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
    image: new FormControl<File | null>(null, Validators.required),
  });

  constructor(
    private incidentService: IncidentService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CreateIncidentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getLocation();
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

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this.setIncidentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        },
        (error) => {
          this.snackbarService.showSnackBar('Unable to load current position');
        }
      );
    } else {
      this.snackbarService.showSnackBar(
        'Geolocation is not supported by this browser.'
      );
    }
  }

  setIncidentLocation(position: { latitude: number; longitude: number }) {
    this.lat = position.latitude;
    this.lng = position.longitude;
    this.incidentForm.controls['latitude'].patchValue(this.lat);
    this.incidentForm.controls['longitude'].patchValue(this.lng);
  }

  addMarker(event: any) {
    this.setIncidentLocation({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    });
  }

  onSubmit() {
    if (!this.incidentForm.valid) {
      return;
    }

    const incidentRequest = {
      description: this.incidentForm.value.description!,
      latitude: this.incidentForm.value.latitude!,
      longitude: this.incidentForm.value.longitude!,
      image: this.incidentForm.value.image!,
    };
    this.incidentService.uploadIncident(incidentRequest).subscribe({
      next: (createdIncident) => {
        this.dialogRef.close(createdIncident);
      },
      error: (error) => console.log(error),
    });
  }
}
