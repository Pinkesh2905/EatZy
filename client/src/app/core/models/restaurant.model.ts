export interface Restaurant {
  _id: string;
  owner: any;
  name: string;
  location: string;
  cuisine: string[];
  rating: number;
  image?: string;
  isApproved: boolean;
  providerType: 'restaurant' | 'home_chef';
  createdAt: string;
}

export interface MenuItem {
  _id: string;
  restaurant: string;
  dishName: string;
  price: number;
  description?: string; // Add this
  category?: string;
  image?: string;
  isAvailable: boolean;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
