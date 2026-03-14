import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${API_BASE_URL}/analytics`;
  private http = inject(HttpClient);

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`);
  }

  getRestaurantStats(restaurantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurant/${restaurantId}`);
  }
}
