"use client";

import { MenuItem } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Leaf } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
    
    // Trigger animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-green-500 text-white font-bold text-2xl rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              +1
            </div>
          </motion.div>
        )}
      </AnimatePresence>

          <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 border-muted/20 group bg-white shadow-lg shadow-orange-100/50 rounded-3xl">

          <div className="relative overflow-hidden">
            <AspectRatio ratio={4 / 3}>
              {item.imageUrl ? (
                <>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              ) : (
                <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                  <Leaf className="h-12 w-12 text-muted-foreground/20" />
                </div>
              )}
            </AspectRatio>
            
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              {!item.isAvailable && (
                <Badge variant="destructive" className="shadow-lg backdrop-blur-md bg-red-500/90 border-none font-bold">
                  Unavailable
                </Badge>
              )}
              {item.isVeg && (
                <Badge variant="outline" className="bg-white/95 backdrop-blur-md border-green-500/50 text-green-600 shadow-lg font-bold py-1">
                  <Leaf className="h-3 w-3 mr-1 fill-green-500" /> Veg
                </Badge>
              )}
              {!item.isVeg && (
                <Badge variant="outline" className="bg-white/95 backdrop-blur-md border-red-500/50 text-red-600 shadow-lg font-bold py-1">
                  Non-Veg
                </Badge>
              )}
            </div>

            {item.preparationTime && (
              <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{item.preparationTime} MINS</span>
                </div>
              </div>
            )}
          </div>
  
          <CardContent className="flex-1 pt-5 px-5">
            <div className="mb-1.5">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
                {item.category}
              </CardDescription>
              <CardTitle className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors duration-300">
                {item.name}
              </CardTitle>
            </div>
            
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mt-2 leading-relaxed font-medium">
                {item.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Price</span>
                <p className="text-2xl font-black text-foreground">₹{item.price}</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-5 pt-0">
            <Button
              className="w-full font-black uppercase tracking-widest h-12 rounded-xl group/btn overflow-hidden relative shadow-lg hover:shadow-primary/20 transition-all duration-300"
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Plus className="h-5 w-5 mr-2 transition-transform duration-500 group-hover/btn:rotate-180" />
                Add to Cart
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Button>
          </CardFooter>
        </Card>
    </motion.div>
  );
}
