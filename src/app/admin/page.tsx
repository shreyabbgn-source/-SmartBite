"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  Gift,
  TrendingUp,
  Loader2,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  DollarSign,
  Package,
  Star,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  loyaltyPoints: number;
  createdAt: string;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isVeg: boolean;
  preparationTime: number | null;
}

interface Order {
  id: number;
  orderId: string;
  userId: number;
  items: any[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderPlacedAt: string;
}

interface Offer {
  id: number;
  title: string;
  description: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  minOrderAmount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

interface SalesAnalytics {
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

interface PopularItem {
  menuItemId: number;
  name: string;
  category: string;
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
}

const CATEGORIES = [
  "Hot Beverages",
  "Cold Beverages",
  "South Indian Snacks",
  "Maharashtrian Snacks",
  "Paratha",
  "Special Snacks",
  "Egg Dishes",
  "Maggie",
  "Sandwiches/Toast",
  "Rolls",
  "Chinese Starter",
  "Chinese Noodles/Rice",
  "Soups",
  "Special Dishes",
  "Punjabi Dishes",
  "Paneer Dishes",
  "Non-Veg Indian Dishes",
  "Rice",
  "Biryani",
  "Bhel/Chaat",
  "Sweet",
  "Thali",
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Analytics state
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRole, setUsersRole] = useState("all");

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategory, setMenuCategory] = useState("all");
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [menuFormData, setMenuFormData] = useState({
    name: "",
    category: "Hot Beverages",
    price: "",
    description: "",
    imageUrl: "",
    isAvailable: true,
    isVeg: true,
    preparationTime: "",
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersStatus, setOrdersStatus] = useState("all");

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerFormData, setOfferFormData] = useState({
    title: "",
    description: "",
    discountType: "percent",
    discountPercent: "",
    discountAmount: "",
    minOrderAmount: "",
    isActive: true,
    validFrom: "",
    validUntil: "",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login");
    } else {
      setLoading(false);
      loadDashboardData();
    }
  }, [isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    await Promise.all([
      fetchSalesAnalytics(),
      fetchPopularItems(),
      fetchUsers(),
      fetchMenuItems(),
      fetchOrders(),
      fetchOffers(),
    ]);
  };

  const fetchSalesAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/sales");
      if (response.ok) {
        const data = await response.json();
        setSalesAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch sales analytics:", error);
    }
  };

  const fetchPopularItems = async () => {
    try {
      const response = await fetch("/api/analytics/popular-items?limit=5");
      if (response.ok) {
        const data = await response.json();
        setPopularItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch popular items:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (usersRole !== "all") params.append("role", usersRole);
      if (usersSearch) params.append("search", usersSearch);
      params.append("limit", "100");

      const response = await fetch(`/api/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const params = new URLSearchParams();
      if (menuCategory !== "all") params.append("category", menuCategory);
      if (menuSearch) params.append("search", menuSearch);
      params.append("limit", "200");

      const response = await fetch(`/api/menu?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (ordersStatus !== "all") params.append("status", ordersStatus);
      params.append("limit", "100");

      const response = await fetch(`/api/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers?limit=100");
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };

  useEffect(() => {
    if (!loading) fetchUsers();
  }, [usersSearch, usersRole]);

  useEffect(() => {
    if (!loading) fetchMenuItems();
  }, [menuSearch, menuCategory]);

  useEffect(() => {
    if (!loading) fetchOrders();
  }, [ordersStatus]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const handleCreateMenuItem = async () => {
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuFormData.name,
          category: menuFormData.category,
          price: parseFloat(menuFormData.price),
          description: menuFormData.description || null,
          imageUrl: menuFormData.imageUrl || null,
          isAvailable: menuFormData.isAvailable,
          isVeg: menuFormData.isVeg,
          preparationTime: menuFormData.preparationTime
            ? parseInt(menuFormData.preparationTime)
            : null,
        }),
      });

      if (response.ok) {
        toast.success("Menu item created successfully");
        setShowMenuDialog(false);
        resetMenuForm();
        fetchMenuItems();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create menu item");
      }
    } catch (error) {
      toast.error("Failed to create menu item");
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem) return;

    try {
      const response = await fetch(`/api/menu?id=${editingMenuItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuFormData.name,
          category: menuFormData.category,
          price: parseFloat(menuFormData.price),
          description: menuFormData.description || null,
          imageUrl: menuFormData.imageUrl || null,
          isAvailable: menuFormData.isAvailable,
          isVeg: menuFormData.isVeg,
          preparationTime: menuFormData.preparationTime
            ? parseInt(menuFormData.preparationTime)
            : null,
        }),
      });

      if (response.ok) {
        toast.success("Menu item updated successfully");
        setShowMenuDialog(false);
        setEditingMenuItem(null);
        resetMenuForm();
        fetchMenuItems();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update menu item");
      }
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Menu item deleted successfully");
        fetchMenuItems();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete menu item");
      }
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const openEditMenuDialog = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable,
      isVeg: item.isVeg,
      preparationTime: item.preparationTime?.toString() || "",
    });
    setShowMenuDialog(true);
  };

  const resetMenuForm = () => {
    setMenuFormData({
      name: "",
      category: "Hot Beverages",
      price: "",
      description: "",
      imageUrl: "",
      isAvailable: true,
      isVeg: true,
      preparationTime: "",
    });
  };

  const handleCreateOffer = async () => {
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: offerFormData.title,
          description: offerFormData.description || null,
          discountPercent:
            offerFormData.discountType === "percent"
              ? parseFloat(offerFormData.discountPercent)
              : null,
          discountAmount:
            offerFormData.discountType === "amount"
              ? parseFloat(offerFormData.discountAmount)
              : null,
          minOrderAmount: parseFloat(offerFormData.minOrderAmount) || 0,
          isActive: offerFormData.isActive,
          validFrom: offerFormData.validFrom,
          validUntil: offerFormData.validUntil,
        }),
      });

      if (response.ok) {
        toast.success("Offer created successfully");
        setShowOfferDialog(false);
        resetOfferForm();
        fetchOffers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create offer");
      }
    } catch (error) {
      toast.error("Failed to create offer");
    }
  };

  const handleUpdateOffer = async () => {
    if (!editingOffer) return;

    try {
      const response = await fetch(`/api/offers?id=${editingOffer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: offerFormData.title,
          description: offerFormData.description || null,
          discountPercent:
            offerFormData.discountType === "percent"
              ? parseFloat(offerFormData.discountPercent)
              : null,
          discountAmount:
            offerFormData.discountType === "amount"
              ? parseFloat(offerFormData.discountAmount)
              : null,
          minOrderAmount: parseFloat(offerFormData.minOrderAmount) || 0,
          isActive: offerFormData.isActive,
          validFrom: offerFormData.validFrom,
          validUntil: offerFormData.validUntil,
        }),
      });

      if (response.ok) {
        toast.success("Offer updated successfully");
        setShowOfferDialog(false);
        setEditingOffer(null);
        resetOfferForm();
        fetchOffers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update offer");
      }
    } catch (error) {
      toast.error("Failed to update offer");
    }
  };

  const openEditOfferDialog = (offer: Offer) => {
    setEditingOffer(offer);
    setOfferFormData({
      title: offer.title,
      description: offer.description || "",
      discountType: offer.discountPercent !== null ? "percent" : "amount",
      discountPercent: offer.discountPercent?.toString() || "",
      discountAmount: offer.discountAmount?.toString() || "",
      minOrderAmount: offer.minOrderAmount.toString(),
      isActive: offer.isActive,
      validFrom: offer.validFrom.split("T")[0],
      validUntil: offer.validUntil.split("T")[0],
    });
    setShowOfferDialog(true);
  };

  const resetOfferForm = () => {
    setOfferFormData({
      title: "",
      description: "",
      discountType: "percent",
      discountPercent: "",
      discountAmount: "",
      minOrderAmount: "",
      isActive: true,
      validFrom: "",
      validUntil: "",
    });
  };

  const handleToggleOfferStatus = async (offer: Offer) => {
    try {
      const response = await fetch(`/api/offers?id=${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !offer.isActive }),
      });

      if (response.ok) {
        toast.success(`Offer ${!offer.isActive ? "activated" : "deactivated"}`);
        fetchOffers();
      } else {
        toast.error("Failed to update offer status");
      }
    } catch (error) {
      toast.error("Failed to update offer status");
    }
  };

  const handleToggleMenuAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/menu?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });

      if (response.ok) {
        toast.success(`Menu item ${!item.isAvailable ? "enabled" : "disabled"}`);
        fetchMenuItems();
      } else {
        toast.error("Failed to update menu item");
      }
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="menu">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Gift className="mr-2 h-4 w-4" />
              Offers
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {salesAnalytics && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{salesAnalytics.summary.totalSales.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {salesAnalytics.summary.totalOrders} orders completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{salesAnalytics.summary.averageOrderValue.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Per order average</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <Package className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {salesAnalytics.summary.totalOrders}
                      </div>
                      <p className="text-xs text-muted-foreground">Orders completed</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Popular Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-orange-500" />
                      Top Selling Items
                    </CardTitle>
                    <CardDescription>Most ordered menu items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {popularItems.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Quantity Sold</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {popularItems.map((item) => (
                            <TableRow key={item.menuItemId}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">{item.totalQuantity}</TableCell>
                              <TableCell className="text-right">
                                ₹{item.totalRevenue.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No sales data available
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{salesAnalytics.paymentBreakdown.completed.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-xl font-bold text-yellow-600">
                          ₹{salesAnalytics.paymentBreakdown.pending.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Failed</p>
                        <p className="text-xl font-bold text-red-600">
                          ₹{salesAnalytics.paymentBreakdown.failed.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Refunded</p>
                        <p className="text-xl font-bold text-gray-600">
                          ₹{salesAnalytics.paymentBreakdown.refunded.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={usersRole} onValueChange={setUsersRole}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Loyalty Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "destructive"
                                  : user.role === "staff"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.phone || "N/A"}</TableCell>
                          <TableCell className="text-right">{user.loyaltyPoints}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Menu Management</CardTitle>
                    <CardDescription>Add, edit, or remove menu items</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingMenuItem(null);
                      resetMenuForm();
                      setShowMenuDialog(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search menu..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={menuCategory} onValueChange={setMenuCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {menuItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell>
                            <Badge variant={item.isVeg ? "default" : "destructive"}>
                              {item.isVeg ? "🥬 Veg" : "🍗 Non-Veg"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleMenuAvailability(item)}
                            >
                              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                {item.isAvailable ? "Available" : "Unavailable"}
                              </Badge>
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditMenuDialog(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMenuItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No menu items found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Select value={ordersStatus} onValueChange={setOrdersStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderId}</TableCell>
                          <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.paymentStatus === "completed"
                                  ? "default"
                                  : order.paymentStatus === "failed"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderPlacedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No orders found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Offers & Loyalty</CardTitle>
                    <CardDescription>Manage discounts and promotional offers</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingOffer(null);
                      resetOfferForm();
                      setShowOfferDialog(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Offer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {offers.length > 0 ? (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <Card key={offer.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{offer.title}</h3>
                                <Badge variant={offer.isActive ? "default" : "secondary"}>
                                  {offer.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              {offer.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {offer.description}
                                </p>
                              )}
                              <div className="flex gap-4 text-sm">
                                <span className="font-medium">
                                  Discount:{" "}
                                  {offer.discountPercent
                                    ? `${offer.discountPercent}%`
                                    : `₹${offer.discountAmount}`}
                                </span>
                                <span>Min Order: ₹{offer.minOrderAmount}</span>
                                <span>
                                  Valid: {new Date(offer.validFrom).toLocaleDateString()} -{" "}
                                  {new Date(offer.validUntil).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleOfferStatus(offer)}
                              >
                                {offer.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditOfferDialog(offer)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No offers found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Menu Item Dialog */}
      <Dialog open={showMenuDialog} onOpenChange={setShowMenuDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
            <DialogDescription>
              {editingMenuItem
                ? "Update the menu item details below"
                : "Fill in the details to create a new menu item"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={menuFormData.name}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, name: e.target.value })
                }
                placeholder="e.g., Masala Dosa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={menuFormData.category}
                onValueChange={(value) =>
                  setMenuFormData({ ...menuFormData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={menuFormData.price}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, price: e.target.value })
                }
                placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparationTime">Prep Time (mins)</Label>
              <Input
                id="preparationTime"
                type="number"
                value={menuFormData.preparationTime}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, preparationTime: e.target.value })
                }
                placeholder="15"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={menuFormData.description}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, description: e.target.value })
                }
                placeholder="Delicious and crispy..."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={menuFormData.imageUrl}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVeg"
                checked={menuFormData.isVeg}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, isVeg: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="isVeg">Vegetarian</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={menuFormData.isAvailable}
                onChange={(e) =>
                  setMenuFormData({ ...menuFormData, isAvailable: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMenuDialog(false);
                setEditingMenuItem(null);
                resetMenuForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingMenuItem ? handleUpdateMenuItem : handleCreateMenuItem}
            >
              {editingMenuItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOffer ? "Edit Offer" : "Create New Offer"}</DialogTitle>
            <DialogDescription>
              {editingOffer
                ? "Update the offer details below"
                : "Fill in the details to create a new promotional offer"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="offerTitle">Title *</Label>
              <Input
                id="offerTitle"
                value={offerFormData.title}
                onChange={(e) =>
                  setOfferFormData({ ...offerFormData, title: e.target.value })
                }
                placeholder="e.g., Weekend Special"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="offerDescription">Description</Label>
              <Input
                id="offerDescription"
                value={offerFormData.description}
                onChange={(e) =>
                  setOfferFormData({ ...offerFormData, description: e.target.value })
                }
                placeholder="Get amazing discounts..."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={offerFormData.discountType}
                onValueChange={(value) =>
                  setOfferFormData({ ...offerFormData, discountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {offerFormData.discountType === "percent" ? (
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Discount % *</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={offerFormData.discountPercent}
                  onChange={(e) =>
                    setOfferFormData({ ...offerFormData, discountPercent: e.target.value })
                  }
                  placeholder="10"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="discountAmount">Discount ₹ *</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  min="0"
                  value={offerFormData.discountAmount}
                  onChange={(e) =>
                    setOfferFormData({ ...offerFormData, discountAmount: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Min Order ₹</Label>
              <Input
                id="minOrderAmount"
                type="number"
                min="0"
                value={offerFormData.minOrderAmount}
                onChange={(e) =>
                  setOfferFormData({ ...offerFormData, minOrderAmount: e.target.value })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From *</Label>
              <Input
                id="validFrom"
                type="date"
                value={offerFormData.validFrom}
                onChange={(e) =>
                  setOfferFormData({ ...offerFormData, validFrom: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until *</Label>
              <Input
                id="validUntil"
                type="date"
                value={offerFormData.validUntil}
                onChange={(e) =>
                  setOfferFormData({ ...offerFormData, validUntil: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="offerActive"
                checked={offerFormData.isActive}
                onChange={(e) =>
                  setOfferFormData({ ...offerFormData, isActive: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="offerActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOfferDialog(false);
                setEditingOffer(null);
                resetOfferForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingOffer ? handleUpdateOffer : handleCreateOffer}>
              {editingOffer ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
