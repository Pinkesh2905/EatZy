import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private authService = inject(AuthService);
  checkoutError = '';
  checkoutLoading = false;

  updateQty(id: string, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    if (this.cartService.cartItems().length === 0) return;

    const items = this.cartService.cartItems();
    const user = this.authService.currentUser();

    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    const restaurantId = items[0]?.restaurant;
    const mixedRestaurants = items.some((item) => item.restaurant !== restaurantId);
    if (mixedRestaurants) {
      this.checkoutError = 'Please place separate orders for different restaurants.';
      return;
    }

    this.checkoutError = '';
    this.checkoutLoading = true;

    const orderData = {
      restaurant: restaurantId,
      items: items.map(i => ({
        dishName: i.dishName,
        price: i.price,
        quantity: i.quantity
      })),
      totalPrice: this.cartService.totalPrice(),
      deliveryAddress: user.address || 'Address not provided'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.checkoutLoading = false;
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.checkoutLoading = false;
        this.checkoutError = err.error?.message || 'Checkout failed';
      }
    });
  }
}
