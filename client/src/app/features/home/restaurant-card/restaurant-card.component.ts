import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../../../core/models/restaurant.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
}
