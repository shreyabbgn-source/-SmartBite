"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Clock, CheckCircle2, XCircle, TrendingUp, Package, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Order {
  id: number;
  orderId: string;
  userId: number;
  items: Array<{ menuItemId: number; name: string; price: number; quantity: number }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderPlacedAt: string;
  pickupTime?: string;
  specialInstructions?: string;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isVeg: boolean;
}

interface Analytics {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  completedToday: number;
}

export default function StaffDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);
  const [updatingMenuItem, setUpdatingMenuItem] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      router.push("/staff/login");
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      const [ordersRes, menuRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/menu?limit=500"),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        calculateAnalytics(ordersData);
      }

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (ordersData: Order[]) => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = ordersData.filter((o) =>
      o.orderPlacedAt.startsWith(today)
    );

    setAnalytics({
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      pendingOrders: ordersData.filter((o) => o.status === "pending").length,
      completedToday: todayOrders.filter((o) => o.status === "completed").length,
    });
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      toast.success(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const toggleMenuAvailability = async (itemId: number, currentStatus: boolean) => {
    setUpdatingMenuItem(itemId);
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update menu item");

      toast.success(`Menu item ${!currentStatus ? "enabled" : "disabled"}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update menu item");
    } finally {
      setUpdatingMenuItem(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      "in-progress": { variant: "default", icon: Package },
      ready: { variant: "default", icon: CheckCircle2 },
      completed: { variant: "outline", icon: CheckCircle2 },
      cancelled: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      pending: "in-progress",
      "in-progress": "ready",
      ready: "completed",
    };
    return statusFlow[currentStatus] || null;
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === "active") {
      return orders.filter((o) => ["pending", "in-progress", "ready"].includes(o.status));
    }
    return orders.filter((o) => o.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Manage orders and menu items.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.todayOrders}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.completedToday} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics.todayRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From {analytics.todayOrders} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Waiting to be processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.todayOrders > 0
                  ? Math.round((analytics.completedToday / analytics.todayOrders) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Of today's orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              {["active", "completed", "cancelled"].map((statusTab) => (
                <TabsContent key={statusTab} value={statusTab} className="space-y-4">
                  {filterOrdersByStatus(statusTab).length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No {statusTab} orders</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filterOrdersByStatus(statusTab).map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                              <CardDescription>
                                Placed: {format(new Date(order.orderPlacedAt), "MMM dd, yyyy hh:mm a")}
                              </CardDescription>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Order Items */}
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Items:</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>
                                  {item.name} x {item.quantity}
                                </span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className="flex justify-between pt-2 border-t font-semibold">
                              <span>Total</span>
                              <span>₹{order.totalAmount}</span>
                            </div>
                          </div>

                          {/* Special Instructions */}
                          {order.specialInstructions && (
                            <div className="bg-secondary/50 p-3 rounded-lg">
                              <p className="text-sm font-semibold mb-1">Special Instructions:</p>
                              <p className="text-sm text-muted-foreground">
                                {order.specialInstructions}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {getNextStatus(order.status) && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                                disabled={updatingOrder === order.id}
                                className="flex-1"
                              >
                                {updatingOrder === order.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  `Mark as ${getNextStatus(order.status)?.replace("-", " ")}`
                                )}
                              </Button>
                              {order.status === "pending" && (
                                <Button
                                  variant="destructive"
                                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                                  disabled={updatingOrder === order.id}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Availability</CardTitle>
                <CardDescription>
                  Toggle item availability. Unavailable items won't be shown to customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline">{item.isVeg ? "🥬 Veg" : "🍗 Non-Veg"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.category} • ₹{item.price}
                        </p>
                      </div>
                      <Button
                        variant={item.isAvailable ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMenuAvailability(item.id, item.isAvailable)}
                        disabled={updatingMenuItem === item.id}
                      >
                        {updatingMenuItem === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : item.isAvailable ? (
                          "Available"
                        ) : (
                          "Unavailable"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
