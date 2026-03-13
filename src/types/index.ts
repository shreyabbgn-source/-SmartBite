export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  phone?: string;
  loyaltyPoints: number;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isVeg: boolean;
  preparationTime?: number;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderId: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'in-progress' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  pickupTime?: string;
  orderPlacedAt: string;
  completedAt?: string;
  specialInstructions?: string;
}

export interface Offer {
  id: number;
  title: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Favorite {
  id: number;
  userId: number;
  menuItemId: number;
  createdAt: string;
}

export interface SalesAnalytics {
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  paymentBreakdown: {
    completed: number;
    pending: number;
    failed: number;
    refunded: number;
  };
  timeline: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

export interface PopularItem {
  menuItemId: number;
  name: string;
  category: string;
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
}
