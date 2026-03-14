import { Injectable, signal, computed } from '@angular/core';
import { MenuItem } from '../models/restaurant.model';

export interface CartItem extends MenuItem {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  addToCart(product: MenuItem) {
    const items = this.cartItems();
    const existingItem = items.find(item => item._id === product._id);

    if (existingItem) {
      this.cartItems.update(items => items.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      this.cartItems.update(items => [...items, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(item => item._id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items => items.map(item => 
      item._id === productId ? { ...item, quantity } : item
    ));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
