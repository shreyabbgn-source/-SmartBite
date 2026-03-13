import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // "student", "staff", "admin"
  phone: text('phone'),
  loyaltyPoints: integer('loyalty_points').default(0),
  createdAt: text('created_at').notNull(),
});

// Menu Items table
export const menuItems = sqliteTable('menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
  isVeg: integer('is_veg', { mode: 'boolean' }).default(true),
  preparationTime: integer('preparation_time'),
  createdAt: text('created_at').notNull(),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id),
  items: text('items', { mode: 'json' }).notNull(), // Array of {menuItemId, name, price, quantity}
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull(), // "pending", "in-progress", "ready", "completed", "cancelled"
  paymentStatus: text('payment_status').notNull(), // "pending", "completed", "failed", "refunded"
  paymentId: text('payment_id'),
  pickupTime: text('pickup_time'),
  orderPlacedAt: text('order_placed_at').notNull(),
  completedAt: text('completed_at'),
  specialInstructions: text('special_instructions'),
});

// Favorites table
export const favorites = sqliteTable('favorites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  menuItemId: integer('menu_item_id').notNull().references(() => menuItems.id),
  createdAt: text('created_at').notNull(),
});

// Offers table
export const offers = sqliteTable('offers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  discountPercent: real('discount_percent'),
  discountAmount: real('discount_amount'),
  minOrderAmount: real('min_order_amount'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  validFrom: text('valid_from').notNull(),
  validUntil: text('valid_until').notNull(),
  createdAt: text('created_at').notNull(),
});