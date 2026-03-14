import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface SubscriptionPlan {
  _id: string;
  planName: string;
  type: 'weekly' | 'monthly';
  price: number;
  mealsPerWeek: number;
  preferences?: any;
  status: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/subscriptions`;

  getMySubscription(): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.apiUrl}/my`);
  }

  createSubscription(plan: any): Observable<SubscriptionPlan> {
    return this.http.post<SubscriptionPlan>(this.apiUrl, plan);
  }
}
