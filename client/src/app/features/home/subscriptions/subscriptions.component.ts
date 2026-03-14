import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {
  plans = [
    {
      name: 'Weekly Vitality',
      type: 'weekly',
      price: 1499,
      meals: 7,
      features: ['1 Meal Daily', 'Nutritional Tracking', 'Free Delivery']
    },
    {
      name: 'Monthly Green',
      type: 'monthly',
      price: 4999,
      meals: 30,
      features: ['1 Meal Daily', 'Full Health Dashboard', 'Priority Support', 'Free Delivery']
    }
  ];

  private subService = inject(SubscriptionService);
  private router = inject(Router);

  selectPlan(plan: any) {
    const subData = {
      planName: plan.name,
      type: plan.type,
      price: plan.price,
      mealsPerWeek: plan.meals,
      preferences: { isVeg: true, spiceLevel: 'medium' }
    };

    this.subService.createSubscription(subData).subscribe({
      next: () => {
        alert('Subscription active! Welcome to the family.');
        this.router.navigate(['/home']);
      },
      error: (err) => alert(err.error.message || 'Subscription failed')
    });
  }
}
