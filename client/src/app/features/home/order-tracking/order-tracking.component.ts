import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  order?: Order;
  loading = true;
  steps = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'picked_up', label: 'Picked Up', icon: '🛵' },
    { key: 'on_the_way', label: 'On the Way', icon: '📍' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private wsService = inject(WebsocketService);

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    if (orderId) {
      this.fetchOrder(orderId);
      this.wsService.joinOrder(orderId);
      this.wsService.onOrderUpdate().subscribe((updatedOrder: Order) => {
        if (updatedOrder._id === orderId) {
          this.order = updatedOrder;
        }
      });
    }
  }

  fetchOrder(id: string) {
    this.orderService.getOrderDetails(id).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getCurrentStepIndex(): number {
    if (!this.order) return -1;
    return this.steps.findIndex(step => step.key === this.order?.status);
  }

  isStepCompleted(index: number): boolean {
    return index <= this.getCurrentStepIndex();
  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }
}
