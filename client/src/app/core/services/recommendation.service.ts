import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/restaurant.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = `${API_BASE_URL}/recommendations`;
  private http = inject(HttpClient);

  getRecommendations(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

  updateGoals(goals: string[]): Observable<string[]> {
    return this.http.put<string[]>(`${this.apiUrl}/goals`, { goals });
  }
}
