export interface Order {
  _id: string;
  user: any;
  restaurant: any;
  items: {
    dishName: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryAddress: string;
  createdAt: string;
}
