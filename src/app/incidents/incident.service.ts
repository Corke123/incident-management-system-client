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

  public getModeratorIncidents() {
    return this.http.get<Incident[]>(
      `${environment.backendUrl}moderator/incidents`
    );
  }

  public uploadIncident(
    incidentRequest: {
      description: string;
      longitude: number;
      latitude: number;
      typeId: string;
    },
    image: File
  ): Observable<Incident> {
    const formData = new FormData();
    formData.append('incident', this.toIncidentRequest(incidentRequest));
    formData.append('image', image);

    return this.http.post<Incident>(
      `${environment.backendUrl}incidents`,
      formData
    );
  }

  private toIncidentRequest(incidentRequest: {
    description: string;
    longitude: number;
    latitude: number;
    typeId: string;
  }): string | Blob {
    return new Blob([JSON.stringify(incidentRequest)], {
      type: 'application/json',
    });
  }
}
