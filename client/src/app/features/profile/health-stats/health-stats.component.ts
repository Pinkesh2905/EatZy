import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-health-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="health-container page-wrapper">
      <div class="glass-card header-card">
        <h1>Your Health <span class="text-primary">Summary</span></h1>
        <p class="subtitle text-muted">Based on your recent organic orders from EatZy.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass-panel">
          <span class="icon">🔥</span>
          <h3>{{ stats.calories | number }}</h3>
          <p>Calories Consumed</p>
        </div>
        <div class="stat-card glass-panel">
          <span class="icon">💪</span>
          <h3>{{ stats.protein | number }}g</h3>
          <p>Total Protein</p>
        </div>
        <div class="stat-card glass-panel">
          <span class="icon">🍞</span>
          <h3>{{ stats.carbs | number }}g</h3>
          <p>Total Carbs</p>
        </div>
        <div class="stat-card glass-panel">
          <span class="icon">🥑</span>
          <h3>{{ stats.fats | number }}g</h3>
          <p>Total Fats</p>
        </div>
      </div>

      @if (subscription) {
        <div class="glass-panel subscription-status">
          <div class="status-info">
            <h3>Active Plan: <span class="text-primary">{{ subscription.planName }}</span></h3>
            <p class="text-muted" style="margin-top: 8px;">Valid until: {{ subscription.endDate | date }}</p>
            <div class="progress-container">
              <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 8px;">
                Remaining Meals: {{ subscription.remainingMeals }} / {{ subscription.mealsPerWeek }}
              </p>
              <div class="progress-bar">
                <div class="fill" [style.width.%]="(subscription.remainingMeals / subscription.mealsPerWeek) * 100"></div>
              </div>
            </div>
          </div>
          <button class="btn btn-outline" style="white-space: nowrap;">Manage Plan</button>
        </div>
      } @else {
        <div class="glass-panel no-sub">
          <h3>No Active Subscription</h3>
          <p class="text-muted">Unlock personalized health insights and priority delivery with our meal plans.</p>
          <button class="btn btn-primary" routerLink="/subscriptions" style="margin-top: 16px;">View Plans</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .health-container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 20px;
    }

    .header-card {
      padding: 40px 24px;
      margin-bottom: 32px;
      text-align: center;
    }

    .header-card h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      padding: 32px 24px;
      text-align: center;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 71, 87, 0.3);
    }

    .stat-card .icon {
      font-size: 40px;
      margin-bottom: 16px;
      display: block;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
    }

    .stat-card h3 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .stat-card p {
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .subscription-status {
      padding: 40px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
    }

    .status-info {
      flex: 1;
    }

    .status-info h3 {
      font-size: 1.5rem;
      margin: 0;
    }

    .progress-container {
      margin-top: 24px;
      width: 100%;
      max-width: 400px;
    }

    .progress-bar {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar .fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
    }

    .no-sub {
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      gap: 8px;
      border: 1px dashed var(--glass-border);
    }

    .no-sub h3 {
      font-size: 1.5rem;
      margin: 0;
    }

    @media screen and (max-width: 600px) {
      .header-card h1 {
        font-size: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .subscription-status {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        padding: 32px 20px;
      }

      .progress-container {
        margin: 24px auto 0;
      }

      .subscription-status .btn-outline {
        width: 100%;
      }
    }
  `]
})
export class HealthStatsComponent implements OnInit {
  stats = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    orderCount: 0
  };
  subscription: any = null;

  private orderService = inject(OrderService);
  private subService = inject(SubscriptionService);

  ngOnInit() {
    this.fetchStats();
    this.subService.getMySubscription().subscribe(sub => this.subscription = sub);
  }

  fetchStats() {
    this.orderService.getMyOrders().subscribe(orders => {
      this.stats.orderCount = orders.length;
      orders.forEach(order => {
        order.items.forEach((item: any) => {
          this.stats.calories += (item.nutritionInfo?.calories || 400) * item.quantity;
          this.stats.protein += (item.nutritionInfo?.protein || 15) * item.quantity;
          this.stats.carbs += (item.nutritionInfo?.carbs || 50) * item.quantity;
          this.stats.fats += (item.nutritionInfo?.fats || 10) * item.quantity;
        });
      });
    });
  }
}
