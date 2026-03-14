import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <div class="glass-card header">
        <h1>Admin <span class="text-primary">Control Center</span></h1>
        <p>Platform-wide overview and management.</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card glass-card">
          <p>Total Revenue</p>
          <h2>₹{{ stats.totalRevenue | number }}</h2>
        </div>
        <div class="stat-card glass-card">
          <p>Active Users</p>
          <h2>{{ stats.totalUsers }}</h2>
        </div>
        <div class="stat-card glass-card">
           <p>Total Orders</p>
           <h2>{{ stats.totalOrders }}</h2>
        </div>
        <div class="stat-card glass-card">
           <p>Active Chefs</p>
           <h2 class="text-warning">{{ stats.activeChefs }}</h2>
        </div>
      </div>

      <div class="trend-section glass-card" *ngIf="stats">
         <h3>Revenue Trends</h3>
         <div class="chart-container">
            <div class="bar" *ngFor="let trend of stats.recentTrends" 
                 [style.height.%]="trend.Sales / 60" 
                 [attr.title]="trend.Month + ': ₹' + trend.Sales">
               <span class="bar-label">{{ trend.Month }}</span>
            </div>
         </div>
      </div>

      <div class="management-section">
        <div class="tabs">
          <button class="tab-btn active">Pending Approvals</button>
          <button class="tab-btn">User Management</button>
          <button class="tab-btn">Platform Logs</button>
        </div>

        <div class="content glass-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Entity Name</th>
                <th>Type</th>
                <th>Requested On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spice Route Kitchen</td>
                <td>Home Chef</td>
                <td>2 hours ago</td>
                <td>
                  <button class="btn-sm btn-success">Approve</button>
                  <button class="btn-sm btn-danger">Reject</button>
                </td>
              </tr>
              <tr>
                <td>Pizza Paradise</td>
                <td>Restaurant</td>
                <td>Yesterday</td>
                <td>
                  <button class="btn-sm btn-success">Approve</button>
                  <button class="btn-sm btn-danger">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
    .header { padding: 32px; text-align: center; margin-bottom: 32px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
    .stat-card { padding: 24px; text-align: center; }
    .management-section { margin-top: 40px; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
    .tab-btn { padding: 10px 20px; border: none; background: transparent; color: white; cursor: pointer; border-radius: 8px; }
    .tab-btn.active { background: var(--primary); }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .btn-sm { padding: 6px 12px; font-size: 12px; margin-right: 5px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-success { background: #2ed573; color: white; }
    .btn-danger { background: #ff4757; color: white; }
    .text-warning { color: #ffa502; }
    .trend-section { padding: 24px; margin-bottom: 40px; }
    .chart-container { display: flex; align-items: flex-end; gap: 20px; height: 200px; padding-top: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .bar { flex: 1; background: var(--primary); border-radius: 4px 4px 0 0; position: relative; min-width: 40px; }
    .bar-label { position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--text-muted); }
  `]
})
export class AdminOverviewComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  stats: any = null;

  ngOnInit() {
    this.analyticsService.getAdminStats().subscribe(data => {
      this.stats = data;
    });
  }
}
