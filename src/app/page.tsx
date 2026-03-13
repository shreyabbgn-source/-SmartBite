"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { MenuItem } from "@/types";
import { MenuCard } from "@/components/MenuCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "All",
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

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, searchQuery, selectedCategory, vegOnly, availableOnly]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu?limit=200");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Veg filter
    if (vegOnly) {
      filtered = filtered.filter((item) => item.isVeg);
    }

    // Available filter
    if (availableOnly) {
      filtered = filtered.filter((item) => item.isAvailable);
    }

    setFilteredItems(filtered);
  };

  const getRecommendedItems = () => {
    const currentHour = new Date().getHours();
    
    // Breakfast (6-11 AM)
    if (currentHour >= 6 && currentHour < 11) {
      return menuItems.filter(
        (item) =>
          item.category === "South Indian Snacks" ||
          item.category === "Paratha" ||
          item.category === "Hot Beverages"
      ).slice(0, 3);
    }
    
    // Lunch (12-3 PM)
    if (currentHour >= 12 && currentHour < 15) {
      return menuItems.filter(
        (item) =>
          item.category === "Thali" ||
          item.category === "Biryani" ||
          item.category === "Rice"
      ).slice(0, 3);
    }
    
    // Evening Snacks (3-6 PM)
    if (currentHour >= 15 && currentHour < 18) {
      return menuItems.filter(
        (item) =>
          item.category === "Bhel/Chaat" ||
          item.category === "Special Snacks" ||
          item.category === "Cold Beverages"
      ).slice(0, 3);
    }
    
    // Dinner (6-10 PM)
    return menuItems.filter(
      (item) =>
        item.category === "Chinese Noodles/Rice" ||
        item.category === "Punjabi Dishes" ||
        item.category === "Paneer Dishes"
    ).slice(0, 3);
  };

  const recommendedItems = getRecommendedItems();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.10.99/build/spline-viewer.js"
        strategy="afterInteractive"
      />
      <main className="flex-1 bg-gradient-to-br from-[#FFFDF5] via-[#FFF5E6] to-[#FFFDF5] min-h-screen">
        {/* Hero Section with Spline Animation */}
        <section className="container py-12 md:py-20">
          <div className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-xl shadow-orange-100/50 border border-white p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span>Fresh & Fast Campus Dining</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 bg-clip-text text-transparent">
                    Campus SmartBite
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-lg">
                  Delicious food, quick service, zero queues. Order your favorite meals in just a few taps!
                </p>
                <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-orange-500/20">
                    Order Now
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-bold bg-white/50">
                    View Menu
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center relative"
              >
                <div className="absolute -inset-4 bg-orange-200/20 blur-3xl rounded-full" />
                <a 
                  href="/nutribot"
                  style={{ width: '100%', height: '450px', maxHeight: '500px', borderRadius: '2rem', position: 'relative', zIndex: 10, overflow: 'hidden', display: 'block', cursor: 'pointer' }}
                >
                  <spline-viewer 
                    url="https://prod.spline.design/A9RkQwLoCcc4HkRj/scene.splinecode"
                    style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                  ></spline-viewer>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        {recommendedItems.length > 0 && (
          <section className="container mb-12">
            <div className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-xl shadow-orange-100/50 border border-white p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <Sparkles className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Recommended for You</h2>
                      <p className="text-sm text-muted-foreground font-medium">Handpicked flavors for this hour</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recommendedItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Filters Section */}
        <section className="container mb-12">
          <div className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-xl shadow-orange-100/50 border border-white p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl">
                  <Filter className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Filter Menu</h3>
                  <p className="text-sm text-muted-foreground font-medium">Find exactly what you crave</p>
                </div>
              </div>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Categories</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        selectedCategory === category 
                        ? "shadow-lg shadow-primary/20 scale-105" 
                        : "hover:bg-slate-100 border-slate-200 text-slate-600"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={vegOnly ? "default" : "outline"}
                    className={`rounded-full px-6 font-bold transition-all ${vegOnly ? "shadow-lg shadow-green-500/20" : "border-slate-200"}`}
                    onClick={() => setVegOnly(!vegOnly)}
                  >
                    🥬 Veg Only
                  </Button>
                  <Button
                    variant={availableOnly ? "default" : "outline"}
                    className={`rounded-full px-6 font-bold transition-all ${availableOnly ? "shadow-lg shadow-blue-500/20" : "border-slate-200"}`}
                    onClick={() => setAvailableOnly(!availableOnly)}
                  >
                    ✅ Available Only
                  </Button>
                </div>
                
                <p className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                  Showing <span className="text-primary">{filteredItems.length}</span> of {menuItems.length} items
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="container pb-24">
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-4 md:p-8 border border-white/50 shadow-xl shadow-orange-100/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading delicious menu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-2xl font-semibold mb-2">No items found</p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setVegOnly(false);
                  setAvailableOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}