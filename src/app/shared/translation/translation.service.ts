import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslationResponse } from './translation-response.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  public translateText(text: string) {
    return this.http.post<TranslationResponse>(
      `http://localhost:8084/api/v1/translate`,
      {
        text: text,
      }
    );
  }
}
