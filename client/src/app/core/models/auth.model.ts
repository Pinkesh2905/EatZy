export type UserRole =
  | 'customer'
  | 'restaurant_owner'
  | 'home_chef'
  | 'delivery_partner'
  | 'admin';

export interface AuthenticatedUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  phone?: string;
  address?: string;
  rewardPoints?: number;
  healthGoals?: string[];
}

export type UserProfile = Omit<AuthenticatedUser, 'token'>;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  address?: string;
}
