"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, LogOut, UtensilsCrossed, History, Bot } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { AuthDialog } from "./AuthDialog";
import { CartDrawer } from "./CartDrawer";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <UtensilsCrossed className="h-6 w-6" />
            <span className="font-bold text-xl">Campus SmartBite</span>
          </div>

<div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0 hover:opacity-90"
                onClick={() => router.push("/nutribot")}
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">NutriBot</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setCartDrawerOpen(true)}
              >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      <Badge className="mt-1 w-fit" variant="secondary">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <History className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  {user.role === "staff" && (
                    <DropdownMenuItem onClick={() => router.push("/staff")}>
                      Staff Dashboard
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setAuthDialogOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}
