import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { Restaurant } from '../../../core/models/restaurant.model';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-chef-list',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent],
  template: `
    <div class="chef-container">
      <div class="header glass-card">
        <h1>Home <span class="text-primary">Chefs</span></h1>
        <p>Authentic, home-cooked meals from local independent kitchens.</p>
      </div>

      <div class="chef-grid">
        <app-restaurant-card 
          *ngFor="let chef of chefs" 
          [restaurant]="chef">
        </app-restaurant-card>
      </div>
      
      <div *ngIf="chefs.length === 0" class="empty-state">
        <p>No home chefs available in your area yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .chef-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
    .header { padding: 40px; text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 48px; margin-bottom: 12px; }
    .chef-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
      gap: 32px; 
    }
    .empty-state { text-align: center; padding: 100px; color: var(--text-muted); }
  `]
})
export class ChefListComponent implements OnInit {
  chefs: Restaurant[] = [];
  private restaurantService = inject(RestaurantService);

  ngOnInit() {
    this.restaurantService.getRestaurants('home_chef').subscribe(data => {
      this.chefs = data;
    });
  }
}
