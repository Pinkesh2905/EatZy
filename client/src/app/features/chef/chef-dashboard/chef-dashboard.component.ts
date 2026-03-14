import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="glass-card header">
        <h1>Chef <span class="text-primary">Dashboard</span></h1>
        <p>Manage your home kitchen and daily specials.</p>
      </div>

      <div class="stats-grid" *ngIf="kitchen">
        <div class="stat-card glass-card">
          <h3>{{ kitchen.name }}</h3>
          <p>Kitchen Status: <span class="badge" [class.active]="kitchen.isApproved">
            {{ kitchen.isApproved ? 'Approved' : 'Pending Approval' }}
          </span></p>
        </div>
        <div class="stat-card glass-card">
          <h3>{{ menu.length }}</h3>
          <p>Active Menu Items</p>
        </div>
      </div>

      <div class="analytics-row" *ngIf="stats">
        <div class="stat-card glass-card secondary">
          <p>Total Revenue</p>
          <h2>₹{{ stats.revenue }}</h2>
        </div>
        <div class="stat-card glass-card secondary">
          <p>Customer Satisfaction</p>
          <h2>{{ stats.efficiency }}</h2>
        </div>
      </div>

      <div class="menu-performance glass-card" *ngIf="stats">
        <h3>Top Selling Dishes</h3>
        <div class="dish-stats">
          <div class="dish-pill" *ngFor="let dish of stats.topDishes">
            {{ dish.dish }}: <strong>{{ dish.quantity }} orders</strong>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <div class="section-header">
          <h2>Your Menu</h2>
          <button class="btn-primary">+ Add New Dish</button>
        </div>
        
        <div class="menu-grid">
          @for (item of menu; track item._id) {
            <div class="menu-item glass-card">
               <div class="item-info">
                 <h3>{{ item.dishName }}</h3>
                 <p>{{ item.description }}</p>
                 <span class="price">₹{{ item.price }}</span>
               </div>
               <div class="actions">
                 <button class="btn-outline">Edit</button>
                 <button class="btn-outline text-danger">Delete</button>
               </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
    .header { padding: 32px; margin-bottom: 32px; text-align: center; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
    .stat-card { padding: 24px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .badge.active { background: rgba(46, 213, 115, 0.2); color: #2ed573; }
    .menu-section { margin-top: 40px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .menu-grid { display: grid; gap: 16px; }
    .menu-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
    .price { font-weight: bold; color: var(--primary); font-size: 18px; }
    .actions { display: flex; gap: 10px; }
    .analytics-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .secondary h2 { color: var(--primary); }
    .menu-performance { padding: 24px; margin-bottom: 40px; }
    .dish-stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
    .dish-pill { background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class ChefDashboardComponent implements OnInit {
  kitchen: any;
  menu: any[] = [];
  stats: any = null;
  private http = inject(HttpClient);
  private analyticsService = inject(AnalyticsService);

  ngOnInit() {
    this.http.get<{kitchen: any, menu: any[]}>(`${API_BASE_URL}/chefs/my-kitchen`).subscribe({
      next: (data) => {
        this.kitchen = data.kitchen;
        this.menu = data.menu;
        
        // Fetch stats if kitchen exists
        if (this.kitchen) {
          this.analyticsService.getRestaurantStats(this.kitchen._id).subscribe(s => this.stats = s);
        }
      },
      error: (err) => console.error('Chef error:', err)
    });
  }
}
