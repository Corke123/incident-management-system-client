import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Type } from './type.model';

@Injectable({
  providedIn: 'root',
})
export class TypeService {
  constructor(private http: HttpClient) {}

  public getTypes() {
    return this.http.get<Type[]>(`${environment.backendUrl}types`);
  }

  public getSubtypes(typeId: string) {
    return this.http.get<Type[]>(
      `${environment.backendUrl}types/${typeId}/subtypes`
    );
  }
}
