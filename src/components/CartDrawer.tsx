"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthDialog } from "./AuthDialog";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      setAuthDialogOpen(true);
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getTotalPrice(),
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      // Initiate Razorpay payment
      await initiateRazorpayPayment({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Rc95kL1tkTf4Le",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Campus SmartBite",
        description: `Order for ${items.length} items`,
        order_id: orderData.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#000000",
        },
        handler: async (response) => {
          // Create order in database
          const dbOrderResponse = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              items: items.map((item) => ({
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
              totalAmount: getTotalPrice(),
              paymentId: response.razorpay_payment_id,
            }),
          });

          if (!dbOrderResponse.ok) {
            throw new Error("Failed to create order");
          }

          const orderData = await dbOrderResponse.json();

          // Update order with payment details
          await fetch(`/api/orders?id=${orderData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentStatus: "completed",
              status: "pending",
            }),
          });

          toast.success("Order placed successfully!");
          clearCart();
          onOpenChange(false);
          router.push(`/orders/${orderData.orderId}`);
        },
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({items.length})
            </SheetTitle>
            <SheetDescription>Review your items before checkout</SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add items from the menu to get started</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[calc(100vh-250px)] mt-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
