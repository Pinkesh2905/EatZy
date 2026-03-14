import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendationService } from '../../../core/services/recommendation.service';
import { MenuItem } from '../../../core/models/restaurant.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="recommendations-section" *ngIf="items.length > 0">
      <div class="section-header">
        <h2>Recommended <span class="text-primary">For You</span></h2>
        <p>Based on your health goals and nutrition preferences.</p>
      </div>

      <div class="goals-bar glass-card" *ngIf="items.length === 0">
        <p>Set your health goals to get personalized recommendations:</p>
        <div class="goal-tags">
          <span *ngFor="let goal of availableGoals" 
                [class.active]="selectedGoals.includes(goal.id)"
                (click)="toggleGoal(goal.id)">
            {{ goal.label }}
          </span>
        </div>
        <button class="btn-primary-sm mt-10" (click)="saveGoals()" [disabled]="selectedGoals.length === 0">
          Save & Get Recommendations
        </button>
      </div>

      <div class="recommendations-carousel" *ngIf="items.length > 0">
        @for (item of items; track item._id) {
          <div class="recommendation-card glass-card">
            <div class="item-header">
               <span class="restaurant-name">{{ item.restaurant?.name }}</span>
               <span class="rating">⭐ {{ item.restaurant?.rating }}</span>
            </div>
            <h3>{{ item.dishName }}</h3>
            <div class="nutrition-badges">
              <span class="badge kcal">{{ item.nutritionInfo?.calories }} kcal</span>
              <span class="badge protein">{{ item.nutritionInfo?.protein }}g Protein</span>
            </div>
            <div class="card-footer">
              <span class="price">₹{{ item.price }}</span>
              <button class="btn-primary-sm" (click)="addToCart(item)">Add</button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .recommendations-section { margin-bottom: 48px; padding: 20px 0; }
    .section-header { margin-bottom: 24px; }
    .recommendations-carousel { 
      display: flex; 
      gap: 20px; 
      overflow-x: auto; 
      padding-bottom: 16px;
      scrollbar-width: thin;
    }
    .recommendation-card { 
      min-width: 280px; 
      padding: 20px; 
      display: flex; 
      flex-direction: column;
      gap: 12px;
      transition: transform 0.3s;
    }
    .recommendation-card:hover { transform: translateY(-5px); }
    .item-header { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
    .nutrition-badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
    .kcal { background: rgba(255, 107, 107, 0.1); color: #ff6b6b; }
    .protein { background: rgba(72, 219, 251, 0.1); color: #48dbfb; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
    .price { font-weight: bold; font-size: 18px; }
    .btn-primary-sm { padding: 6px 16px; font-size: 12px; border: none; background: var(--primary); color: white; border-radius: 6px; cursor: pointer; }
    .btn-primary-sm:disabled { opacity: 0.5; cursor: not-allowed; }
    .goals-bar { padding: 24px; text-align: center; }
    .goal-tags { display: flex; gap: 12px; justify-content: center; margin: 16px 0; }
    .goal-tags span { padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; cursor: pointer; transition: 0.3s; }
    .goal-tags span.active { background: var(--primary); border-color: var(--primary); }
    .mt-10 { margin-top: 10px; }
  `]
})
export class RecommendationsComponent implements OnInit {
  items: any[] = [];
  selectedGoals: string[] = [];
  availableGoals = [
    { id: 'high_protein', label: 'High Protein' },
    { id: 'low_carb', label: 'Low Carb' },
    { id: 'low_fat', label: 'Low Fat' },
    { id: 'vegan', label: 'Vegan' }
  ];

  private recommendationService = inject(RecommendationService);
  private cartService = inject(CartService);

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.recommendationService.getRecommendations().subscribe(data => {
      this.items = data;
    });
  }

  toggleGoal(goalId: string) {
    if (this.selectedGoals.includes(goalId)) {
      this.selectedGoals = this.selectedGoals.filter(g => g !== goalId);
    } else {
      this.selectedGoals.push(goalId);
    }
  }

  saveGoals() {
    this.recommendationService.updateGoals(this.selectedGoals).subscribe(() => {
      this.loadRecommendations();
    });
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
  }
}
