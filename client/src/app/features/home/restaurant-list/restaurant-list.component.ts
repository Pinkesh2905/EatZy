import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RecommendationsComponent } from '../recommendations/recommendations.component';
import { Restaurant } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent, RecommendationsComponent],
  template: `
    <div class="home-container">
      <app-recommendations></app-recommendations>

      <div class="section-header">
        <h1>Explore <span class="text-primary">Restaurants</span></h1>
      </div>

      <div *ngIf="loading" class="loader">Loading restaurants...</div>
      
      <div *ngIf="error" class="error-msg">{{ error }}</div>

      <div class="restaurant-grid" *ngIf="!loading && !error">
        @for (restaurant of restaurants; track restaurant._id) {
          <app-restaurant-card [restaurant]="restaurant"></app-restaurant-card>
        }
      </div>
    </div>
  `,
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = true;
  error = '';

  private restaurantService = inject(RestaurantService);

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load restaurants';
        this.loading = false;
      }
    });
  }
}
