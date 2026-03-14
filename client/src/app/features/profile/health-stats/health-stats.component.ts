import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { SubscriptionService } from '../../../core/services/subscription.service';

@Component({
  selector: 'app-health-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-stats.component.html',
  styleUrl: './health-stats.component.css'
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
          // This is a simplification; usually we'd need to fetch full menu item info if not in order
          // But for now, we assume nutritionInfo is available or we show mock aggregates
          this.stats.calories += (item.nutritionInfo?.calories || 400) * item.quantity;
          this.stats.protein += (item.nutritionInfo?.protein || 15) * item.quantity;
          this.stats.carbs += (item.nutritionInfo?.carbs || 50) * item.quantity;
          this.stats.fats += (item.nutritionInfo?.fats || 10) * item.quantity;
        });
      });
    });
  }
}
