import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-container page-wrapper">
      <div class="glass-card header">
        <h1>Delivery <span class="text-primary">Station</span></h1>
        <p class="text-muted">Manage your availability and track your earnings.</p>
      </div>

      <div class="status-toggle glass-panel">
        <div class="status-info">
          <h3>Current Status</h3>
          <p [class.online]="isOnline" class="status-text">
            {{ isOnline ? 'You are currently Online' : 'You are currently Offline' }}
          </p>
        </div>
        <button class="btn" [class]="isOnline ? 'btn-danger' : 'btn-success'" (click)="toggleStatus()">
          {{ isOnline ? 'Go Offline' : 'Go Online' }}
        </button>
      </div>

      <div class="earnings-grid">
        <div class="stat-card glass-panel">
          <p class="text-muted">Deliveries Today</p>
          <h2>0</h2>
        </div>
        <div class="stat-card glass-panel">
          <p class="text-muted">Total Earnings</p>
          <h2 class="text-primary">₹0.00</h2>
        </div>
      </div>

      <div class="queue-section">
        <h2 style="margin-bottom: 20px;">Live Delivery Queue</h2>
        <div class="empty-queue glass-panel">
          <p>No active delivery requests at the moment. Stay online to receive orders!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .delivery-container { 
      max-width: 800px; 
      margin: 0 auto; 
    }
    
    .header { 
      padding: 40px 24px; 
      text-align: center; 
      margin-bottom: 32px; 
    }
    
    .status-toggle { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 32px 24px; 
      margin-bottom: 32px;
      border-left: 6px solid var(--text-muted);
      transition: var(--transition);
    }
    
    .status-toggle:has(.online) { 
      border-left-color: #2ed573; 
    }
    
    .status-info h3 {
      font-size: 1.25rem;
      margin-bottom: 8px;
    }

    .status-text {
      color: var(--text-muted);
      font-weight: 500;
    }
    
    .online { 
      color: #2ed573; 
      font-weight: 700; 
    }
    
    .earnings-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 24px; 
      margin-bottom: 40px; 
    }
    
    .stat-card { 
      padding: 32px 24px; 
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .stat-card h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
    }
    
    .empty-queue { 
      padding: 60px 20px; 
      text-align: center; 
      color: var(--text-muted); 
      border: 1px dashed var(--glass-border);
    }
    
    .btn-success { 
      background: #2ed573; 
      color: white; 
      border: none; 
      box-shadow: 0 4px 15px rgba(46, 213, 115, 0.3);
    }
    
    .btn-success:hover {
      background: #26af5f;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(46, 213, 115, 0.4);
    }
    
    .btn-danger { 
      background: #ff4757; 
      color: white; 
      border: none; 
      box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
    }
    
    .btn-danger:hover {
      background: #e84118;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
    }

    @media screen and (max-width: 600px) {
      .status-toggle {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
        text-align: center;
        border-left: none;
        border-top: 6px solid var(--text-muted);
      }

      .status-toggle:has(.online) { 
        border-top-color: #2ed573; 
        border-left: none;
      }
    }
  `]
})
export class DeliveryDashboardComponent implements OnInit {
  isOnline = false;
  private http = inject(HttpClient);

  ngOnInit() {
    // Initial fetch of status could be added here
  }

  toggleStatus() {
    this.http.put<{success: boolean, isOnline: boolean}>(`${API_BASE_URL}/delivery/status`, {}).subscribe({
      next: (res) => this.isOnline = res.isOnline,
      error: (err) => alert('Failed to toggle status')
    });
  }
}
