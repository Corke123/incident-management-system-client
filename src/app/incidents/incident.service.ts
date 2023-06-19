import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Incident } from './incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  public getIncidents() {
    return this.http.get<Incident[]>(`${environment.backendUrl}incidents`);
  }
}
