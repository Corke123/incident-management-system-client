import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Incident } from './incident.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  public getIncidents() {
    return this.http.get<Incident[]>(`${environment.backendUrl}incidents`);
  }

  public uploadIncident(incidentRequest: {
    description: string;
    longitude: number;
    latitude: number;
    image: File;
  }): Observable<Incident> {
    const formData = new FormData();
    formData.append('description', incidentRequest.description);
    formData.append('longitude', incidentRequest.longitude.toString());
    formData.append('latitude', incidentRequest.latitude.toString());
    formData.append('image', incidentRequest.image);

    return this.http.post<Incident>(
      `${environment.backendUrl}incidents`,
      formData
    );
  }
}
