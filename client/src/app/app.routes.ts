import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { RestaurantListComponent } from './features/home/restaurant-list/restaurant-list.component';
import { RestaurantDetailsComponent } from './features/home/restaurant-details/restaurant-details.component';
import { CartComponent } from './features/home/cart/cart.component';
import { OrderHistoryComponent } from './features/home/order-history/order-history.component';
import { OrderTrackingComponent } from './features/home/order-tracking/order-tracking.component';
import { SubscriptionsComponent } from './features/home/subscriptions/subscriptions.component';
import { HealthStatsComponent } from './features/profile/health-stats/health-stats.component';
import { ChefListComponent } from './features/home/chef-list/chef-list.component';
import { ChefDashboardComponent } from './features/chef/chef-dashboard/chef-dashboard.component';
import { DeliveryDashboardComponent } from './features/delivery/delivery-dashboard/delivery-dashboard.component';
import { AdminOverviewComponent } from './features/admin/admin-overview/admin-overview.component';
import { GroupOrderComponent } from './features/home/group-order/group-order.component';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: RestaurantListComponent },
  { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'restaurant/:id', component: RestaurantDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
  { path: 'track/:id', component: OrderTrackingComponent, canActivate: [authGuard] },
  { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [authGuard] },
  { path: 'health-stats', component: HealthStatsComponent, canActivate: [authGuard] },
  { path: 'chefs', component: ChefListComponent },
  {
    path: 'chef/dashboard',
    component: ChefDashboardComponent,
    canActivate: [authGuard, roleGuard(['home_chef', 'admin'])]
  },
  {
    path: 'delivery/dashboard',
    component: DeliveryDashboardComponent,
    canActivate: [authGuard, roleGuard(['delivery_partner', 'admin'])]
  },
  {
    path: 'admin/overview',
    component: AdminOverviewComponent,
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  { path: 'group/:code', component: GroupOrderComponent, canActivate: [authGuard] }
];
