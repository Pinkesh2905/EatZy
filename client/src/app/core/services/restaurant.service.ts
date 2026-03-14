import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant, MenuItem } from '../models/restaurant.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = `${API_BASE_URL}/restaurants`;

  constructor(private http: HttpClient) {}

  getRestaurants(type: 'restaurant' | 'home_chef' = 'restaurant'): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}?type=${type}`);
  }

  getRestaurantDetails(id: string): Observable<{ restaurant: Restaurant, menu: MenuItem[] }> {
    return this.http.get<{ restaurant: Restaurant, menu: MenuItem[] }>(`${this.apiUrl}/${id}`);
  }

  createRestaurant(restaurantData: any): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.apiUrl, restaurantData);
  }
}
