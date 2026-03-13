"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Shield, Users, ChefHat, Phone } from "lucide-react";

export function Footer() {
  const router = useRouter();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        {/* Emergency Contact Banner */}
        <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Phone className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-orange-700 dark:text-orange-400">Emergency Orders (Electricity Outage)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            In case of power outage, send SMS to place orders
          </p>
          <a 
            href="sms:+918750661710" 
            className="text-lg font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            +91 8750661710
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Portal */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-3">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">Student Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Order food, track orders, and view history
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </div>
          </div>

          {/* Staff Portal */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3">
              <ChefHat className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Staff Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage orders and update menu availability
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/staff/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/staff/register")}
              >
                Register
              </Button>
            </div>
          </div>

          {/* Admin Portal */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-3">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Admin Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              User management, analytics, and system control
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Campus SmartBite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}