"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, Clock, CheckCircle, ChefHat, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { user, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    fetchOrder();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId, user, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const orders = await response.json();
        const foundOrder = orders.find((o: Order) => o.orderId === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderProgress = () => {
    if (!order) return 0;
    
    switch (order.status) {
      case "pending":
        return 25;
      case "in-progress":
        return 50;
      case "ready":
        return 75;
      case "completed":
        return 100;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const getEstimatedTime = () => {
    if (!order) return null;
    
    const totalPrepTime = order.items.reduce((total, item) => {
      // Assuming average prep time of 15 minutes if not specified
      return total + 15;
    }, 0);

    // Average the preparation time
    const avgPrepTime = Math.ceil(totalPrepTime / order.items.length);
    
    switch (order.status) {
      case "pending":
        return `${avgPrepTime} min`;
      case "in-progress":
        return `${Math.ceil(avgPrepTime / 2)} min`;
      case "ready":
        return "Ready for pickup";
      case "completed":
        return "Completed";
      default:
        return null;
    }
  };

  const orderSteps = [
    {
      status: "pending",
      label: "Order Placed",
      icon: <Clock className="h-6 w-6" />,
      description: "Your order has been received",
    },
    {
      status: "in-progress",
      label: "Preparing",
      icon: <ChefHat className="h-6 w-6" />,
      description: "Chef is preparing your food",
    },
    {
      status: "ready",
      label: "Ready",
      icon: <Package className="h-6 w-6" />,
      description: "Your order is ready for pickup",
    },
    {
      status: "completed",
      label: "Completed",
      icon: <CheckCircle className="h-6 w-6" />,
      description: "Order delivered successfully",
    },
  ];

  if (loading) {
    return (
      <div className="container py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-20">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">Order not found</p>
            <Button onClick={() => router.push("/orders")} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = getOrderProgress();
  const estimatedTime = getEstimatedTime();
  const currentStepIndex = orderSteps.findIndex((step) => step.status === order.status);

  return (
    <main className="container py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Status Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Order #{order.orderId}</CardTitle>
                    <CardDescription>
                      Placed on {format(new Date(order.orderPlacedAt), "PPp")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-sm"
                  >
                    {order.status.toUpperCase().replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Progress Bar */}
                {order.status !== "cancelled" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Order Progress</span>
                      {estimatedTime && (
                        <span className="text-muted-foreground">
                          Est. {estimatedTime}
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Order Steps */}
                <div className="space-y-6">
                  {orderSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            className={`rounded-full p-3 ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {step.icon}
                          </motion.div>
                          {index < orderSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-12 mt-2 ${
                                isActive ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h3
                            className={`font-semibold ${
                              isCurrent ? "text-primary" : ""
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          {isCurrent && order.status !== "completed" && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2"
                            >
                              <Badge variant="outline" className="animate-pulse">
                                In Progress
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.status === "cancelled" && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive font-medium">
                      This order has been cancelled
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span>₹0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Payment Details</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        order.paymentStatus === "completed"
                          ? "default"
                          : order.paymentStatus === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment ID</span>
                      <span className="font-mono text-xs">
                        {order.paymentId.slice(0, 12)}...
                      </span>
                    </div>
                  )}
                </div>

                {order.specialInstructions && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Special Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.specialInstructions}
                      </p>
                    </div>
                  </>
                )}

                {order.pickupTime && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Pickup Time</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.pickupTime), "PPp")}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {order.status === "ready" && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                    <h3 className="font-bold text-lg">Order Ready!</h3>
                    <p className="text-sm text-muted-foreground">
                      Please collect your order from the counter
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
