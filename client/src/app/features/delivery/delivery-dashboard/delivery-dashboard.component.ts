import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/config/api.config';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-container">
      <div class="glass-card header">
        <h1>Delivery <span class="text-primary">Station</span></h1>
        <p>Manage your availability and track your earnings.</p>
      </div>

      <div class="status-toggle glass-card">
        <div class="status-info">
          <h3>Current Status</h3>
          <p [class.online]="isOnline">{{ isOnline ? 'You are currently Online' : 'You are currently Offline' }}</p>
        </div>
        <button [class]="isOnline ? 'btn-danger' : 'btn-success'" (click)="toggleStatus()">
          {{ isOnline ? 'Go Offline' : 'Go Online' }}
        </button>
      </div>

      <div class="earnings-grid">
        <div class="stat-card glass-card">
          <p>Deliveries Today</p>
          <h2>0</h2>
        </div>
        <div class="stat-card glass-card">
          <p>Total Earnings</p>
          <h2>₹0.00</h2>
        </div>
      </div>

      <div class="queue-section">
        <h2>Live Delivery Queue</h2>
        <div class="empty-queue glass-card">
          <p>No active delivery requests at the moment. Stay online to receive orders!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .delivery-container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
    .header { padding: 32px; text-align: center; margin-bottom: 24px; }
    .status-toggle { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 24px; 
      margin-bottom: 24px;
      border-left: 5px solid #ccc;
    }
    .status-toggle:has(.online) { border-left-color: #2ed573; }
    .online { color: #2ed573; font-weight: bold; }
    .earnings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
    .stat-card { padding: 24px; text-align: center; }
    .queue-section h2 { margin-bottom: 16px; }
    .empty-queue { padding: 40px; text-align: center; color: var(--text-muted); }
    .btn-success { background: #2ed573; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
    .btn-danger { background: #ff4757; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
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
