import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container page-wrapper">
      <div class="glass-card header">
        <h1>Admin <span class="text-primary">Control Center</span></h1>
        <p class="text-muted">Platform-wide overview and management.</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card glass-panel">
          <p class="text-muted">Total Revenue</p>
          <h2 class="text-primary">₹{{ stats.totalRevenue | number }}</h2>
        </div>
        <div class="stat-card glass-panel">
          <p class="text-muted">Active Users</p>
          <h2>{{ stats.totalUsers }}</h2>
        </div>
        <div class="stat-card glass-panel">
           <p class="text-muted">Total Orders</p>
           <h2>{{ stats.totalOrders }}</h2>
        </div>
        <div class="stat-card glass-panel">
           <p class="text-muted">Active Chefs</p>
           <h2 class="text-accent">{{ stats.activeChefs }}</h2>
        </div>
      </div>

      <div class="trend-section glass-panel" *ngIf="stats">
         <h3 style="margin-bottom: 20px;">Revenue Trends</h3>
         <div class="chart-wrapper">
           <div class="chart-container">
              <div class="bar" *ngFor="let trend of stats.recentTrends" 
                   [style.height.%]="trend.Sales / 60" 
                   [attr.title]="trend.Month + ': ₹' + trend.Sales">
                 <span class="bar-label">{{ trend.Month }}</span>
              </div>
           </div>
         </div>
      </div>

      <div class="management-section">
        <div class="tabs-scroll-container">
          <div class="tabs">
            <button class="tab-btn active">Pending Approvals</button>
            <button class="tab-btn">User Management</button>
            <button class="tab-btn">Platform Logs</button>
          </div>
        </div>

        <div class="content glass-panel table-container">
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
                <td data-label="Entity Name">Spice Route Kitchen</td>
                <td data-label="Type">Home Chef</td>
                <td data-label="Requested On">2 hours ago</td>
                <td data-label="Actions" class="action-cell">
                  <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">Approve</button>
                  <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; border-color: #ff4757; color: #ff4757;">Reject</button>
                </td>
              </tr>
              <tr>
                <td data-label="Entity Name">Pizza Paradise</td>
                <td data-label="Type">Restaurant</td>
                <td data-label="Requested On">Yesterday</td>
                <td data-label="Actions" class="action-cell">
                  <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">Approve</button>
                  <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; border-color: #ff4757; color: #ff4757;">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { 
      max-width: var(--container-max); 
      margin: 0 auto; 
      padding: 0 20px; 
    }
    
    .header { 
      padding: 40px 24px; 
      text-align: center; 
      margin-bottom: 32px; 
    }
    
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
      gap: 24px; 
      margin-bottom: 40px; 
    }
    
    .stat-card { 
      padding: 24px; 
      text-align: center; 
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: center;
    }
    
    .stat-card h2 {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0;
    }

    .management-section { margin-top: 40px; }
    
    /* Scrollable Tabs for Mobile */
    .tabs-scroll-container {
      width: 100%;
      overflow-x: auto;
      margin-bottom: 20px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Firefox */
    }
    .tabs-scroll-container::-webkit-scrollbar { display: none; } /* Chrome */
    
    .tabs { 
      display: flex; 
      gap: 12px; 
      min-width: max-content;
    }
    
    .tab-btn { 
      padding: 12px 24px; 
      border: 1px solid var(--glass-border); 
      background: var(--glass-bg); 
      color: var(--text-muted); 
      cursor: pointer; 
      border-radius: var(--border-radius); 
      font-weight: 600;
      transition: var(--transition);
      white-space: nowrap;
    }
    
    .tab-btn.active, .tab-btn:hover { 
      background: rgba(255, 71, 87, 0.1); 
      color: var(--primary);
      border-color: rgba(255, 71, 87, 0.3);
    }

    /* Scrollable Chart wrapper */
    .chart-wrapper {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 20px; /* Space for labels */
    }
    
    .chart-container { 
      display: flex; 
      align-items: flex-end; 
      gap: 20px; 
      height: 250px; 
      padding-top: 20px; 
      border-bottom: 1px solid var(--glass-border); 
      min-width: 600px; /* Force scroll on small screens */
    }
    
    .bar { 
      flex: 1; 
      background: linear-gradient(to top, var(--primary-dark), var(--primary)); 
      border-radius: 6px 6px 0 0; 
      position: relative; 
      min-width: 40px; 
      transition: height 1s ease-out;
    }
    
    .bar-label { 
      position: absolute; 
      bottom: -30px; 
      left: 50%; 
      transform: translateX(-50%); 
      font-size: 0.85rem; 
      color: var(--text-muted); 
    }

    /* Responsive Table wrapper */
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .admin-table { 
      width: 100%; 
      border-collapse: collapse; 
      min-width: 600px;
    }
    
    .admin-table th {
      padding: 16px; 
      text-align: left; 
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--glass-border); 
    }

    .admin-table td { 
      padding: 20px 16px; 
      text-align: left; 
      border-bottom: 1px solid rgba(255,255,255,0.05); 
      vertical-align: middle;
    }

    .action-cell {
      display: flex;
      gap: 10px;
    }

    /* Mobile Table Card View */
    @media (max-width: 768px) {
      .header h1 { font-size: 2rem; }
      
      .stats-grid { 
        grid-template-columns: repeat(2, 1fr); 
      }

      /* Stack table rows on mobile */
      .admin-table { min-width: 100%; }
      .admin-table thead { display: none; }
      .admin-table tbody tr {
        display: block;
        margin-bottom: 16px;
        background: rgba(0,0,0,0.2);
        border-radius: var(--border-radius);
        border: 1px solid var(--glass-border);
      }
      .admin-table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        text-align: right;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .admin-table td::before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--text-muted);
        text-align: left;
      }
      .action-cell {
        justify-content: flex-end;
      }
    }
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
