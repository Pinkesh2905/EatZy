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
    <div class="dashboard-container page-wrapper">
      <div class="glass-card header">
        <h1>Chef <span class="text-primary">Dashboard</span></h1>
        <p class="text-muted">Manage your home kitchen and daily specials.</p>
      </div>

      <div class="stats-grid" *ngIf="kitchen">
        <div class="stat-card glass-panel">
          <h3 class="stat-title">{{ kitchen.name }}</h3>
          <p class="text-muted">Status: <span class="badge" [class.active]="kitchen.isApproved">
            {{ kitchen.isApproved ? 'Approved' : 'Pending Approval' }}
          </span></p>
        </div>
        <div class="stat-card glass-panel">
          <h3 class="stat-value">{{ menu.length }}</h3>
          <p class="text-muted">Active Menu Items</p>
        </div>
      </div>

      <div class="analytics-row" *ngIf="stats">
        <div class="stat-card glass-panel secondary">
          <p class="text-muted">Total Revenue</p>
          <h2 class="text-primary">₹{{ stats.revenue }}</h2>
        </div>
        <div class="stat-card glass-panel secondary">
          <p class="text-muted">Customer Satisfaction</p>
          <h2>{{ stats.efficiency }}</h2>
        </div>
      </div>

      <div class="menu-performance glass-panel" *ngIf="stats">
        <h3 style="margin-bottom: 16px;">Top Selling Dishes</h3>
        <div class="dish-stats">
          <div class="dish-pill" *ngFor="let dish of stats.topDishes">
            {{ dish.dish }}: <strong>{{ dish.quantity }} orders</strong>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <div class="section-header">
          <h2>Your Menu</h2>
          <button class="btn btn-primary">+ Add New Dish</button>
        </div>
        
        <div class="menu-grid">
          @for (item of menu; track item._id) {
            <div class="menu-item-card glass-card">
               <div class="item-info">
                 <h3>{{ item.dishName }}</h3>
                 <p class="text-muted dish-desc">{{ item.description }}</p>
                 <span class="price">₹{{ item.price }}</span>
               </div>
               <div class="actions-group">
                 <button class="btn btn-secondary btn-sm">Edit</button>
                 <button class="btn btn-outline btn-sm text-danger" style="border-color: #ff4757; color: #ff4757;">Delete</button>
               </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { 
      max-width: var(--container-max); 
      margin: 0 auto; 
      padding: 0 20px; 
    }
    .header { 
      padding: 40px 24px; 
      margin-bottom: 32px; 
      text-align: center; 
    }
    
    .stats-grid, .analytics-row { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 24px; 
      margin-bottom: 24px; 
    }
    
    .stat-card { 
      padding: 24px; 
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    
    .stat-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
    }
    
    .badge { 
      padding: 6px 14px; 
      border-radius: 20px; 
      font-size: 0.85rem; 
      font-weight: 600;
      background: rgba(255, 255, 255, 0.1);
      margin-left: 8px;
    }
    .badge.active { background: rgba(46, 213, 115, 0.2); color: #2ed573; box-shadow: 0 0 10px rgba(46, 213, 115, 0.2); }
    
    .menu-section { margin-top: 40px; }
    
    .section-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 24px; 
    }
    
    .menu-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px; 
    }
    
    .menu-item-card { 
      display: flex; 
      flex-direction: column;
      justify-content: space-between; 
      padding: 24px; 
      gap: 20px;
    }
    
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .item-info h3 {
      font-size: 1.25rem;
      margin: 0;
    }

    .dish-desc {
      font-size: 0.95rem;
      flex: 1;
      line-height: 1.5;
    }

    .price { font-weight: 800; color: var(--primary); font-size: 1.3rem; margin-top: 8px; display: block;}
    
    .actions-group { 
      display: flex; 
      gap: 12px; 
      margin-top: 10px;
      padding-top: 20px;
      border-top: 1px solid var(--glass-border);
    }
    
    .btn-sm { padding: 8px 16px; font-size: 0.9rem; flex: 1; }
    
    .secondary h2 { color: var(--primary); font-size: 2.5rem; font-weight: 800; margin: 0; }
    
    .menu-performance { padding: 24px; margin-bottom: 40px; }
    
    .dish-stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
    
    .dish-pill { 
      background: rgba(255,255,255,0.05); 
      padding: 10px 18px; 
      border-radius: 20px; 
      border: 1px solid var(--glass-border); 
      font-size: 0.9rem;
      transition: var(--transition);
    }
    
    .dish-pill:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.2);
    }

    @media screen and (max-width: 600px) {
      .stats-grid, .analytics-row {
        grid-template-columns: 1fr;
      }

      .menu-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .section-header .btn {
        width: 100%;
      }
    }
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
