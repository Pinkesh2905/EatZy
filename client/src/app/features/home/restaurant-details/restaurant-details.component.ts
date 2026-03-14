import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { CartService } from '../../../core/services/cart.service';
import { GroupOrderService } from '../../../core/services/group-order.service';
import { Restaurant, MenuItem } from '../../../core/models/restaurant.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (restaurant) {
      <div class="details-container">
        <div class="header-banner" [style.background-image]="'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(' + bannerUrl + ')'">
          <div class="header-content">
            <a routerLink="/home" class="back-link">← Back to Restaurants</a>
            <h1>{{ restaurant.name }}</h1>
            <p class="cuisine-list">
              @for (c of restaurant.cuisine; track c) {
                <span>{{ c }}</span>
              }
            </p>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-grid">
            @for (item of menu; track item._id) {
              <div class="menu-item-card glass-card">
                <div class="item-info">
                  <h3>{{ item.dishName }}</h3>
                  <p class="dish-description">{{ item.description }}</p>
                  
                  @if (item.nutritionInfo) {
                    <div class="nutrition-badges">
                      <span class="badge calorie-badge">{{ item.nutritionInfo.calories }} kcal</span>
                      <span class="badge protein-badge">{{ item.nutritionInfo.protein }}g P</span>
                      <span class="badge carbs-badge">{{ item.nutritionInfo.carbs }}g C</span>
                      <span class="badge fats-badge">{{ item.nutritionInfo.fats }}g F</span>
                    </div>
                  }

                  <div class="menu-item-footer">
                    <span class="price">₹{{ item.price }}</span>
                    <div class="actions">
                      <button class="btn-primary" 
                              *ngIf="!activeGroup()"
                              (click)="addToCart(item)">Add to Cart</button>
                      <button class="btn-group-add" 
                              *ngIf="activeGroup()"
                              (click)="addToGroupCart(item)">Add to Group</button>
                    </div>
                  </div>
                </div>
                @if (item.image) {
                  <div class="item-image">
                    <img [src]="item.image" [alt]="item.dishName">
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }

    @if (loading) {
      <div class="loader-state">
        <p>Loading your favorite flavors...</p>
      </div>
    }
  `,
  styleUrl: './restaurant-details.component.css'
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant: Restaurant | null = null;
  menu: MenuItem[] = [];
  loading = true;
  error = '';

  public route = inject(ActivatedRoute);
  public restaurantService = inject(RestaurantService);
  public cartService = inject(CartService);
  public groupOrderService = inject(GroupOrderService);
  public router = inject(Router);
  private authService = inject(AuthService);
  
  public activeGroup = this.groupOrderService.activeGroup;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurantService.getRestaurantDetails(id).subscribe({
        next: (data) => {
          this.restaurant = data.restaurant;
          this.menu = data.menu;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load restaurant details';
          this.loading = false;
        }
      });
    }
  }

  get bannerUrl(): string {
    return this.restaurant?.image || 'assets/images/default-food.jpg';
  }

  addToCart(item: MenuItem) {
    this.cartService.addToCart(item);
  }

  addToGroupCart(item: MenuItem) {
    const group = this.activeGroup();
    if (!group) return;

    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    let member = group.members.find((m: any) => m.user._id === currentUser._id);
    
    if (!member) {
        member = { user: { _id: currentUser._id, name: currentUser.name }, items: [] };
        group.members.push(member);
    }
    
    member.items.push({ dishName: item.dishName, price: item.price, quantity: 1 });
    this.groupOrderService.updateGroupCart(group);
  }

  getBannerStyle() {
    return {
      'background-image': `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${this.bannerUrl})`
    };
  }
}
