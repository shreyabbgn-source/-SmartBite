"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { ChatMessage, LoggedMeal, UserProfile, CalorieDetails } from '@/types/nutribot';
import { CANTEEN_MENU } from '@/lib/nutribot/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface NutriBotChatProps {
  profile: UserProfile;
  dailyLog: LoggedMeal[];
  onLogMeals: (meals: { foodName: string; quantity: number }[]) => void;
  calorieDetails: CalorieDetails;
}

export function NutriBotChat({ profile, dailyLog, onLogMeals, calorieDetails }: NutriBotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: "Welcome to Campus NutriBot! I'm here to help you make healthy food choices at the canteen. Tell me what you ate or ask for meal recommendations!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/nutribot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          profile,
          dailyLog,
          targetCalories: calorieDetails.target
        })
      });

      const data = await response.json();

      if (data.extractedMeals && data.extractedMeals.length > 0) {
        onLogMeals(data.extractedMeals);
      }

      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.responseText || data.error || 'Sorry, I could not process that.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: 'Oops! Something went wrong. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'model',
      content: "Chat cleared! How can I help you with your nutrition today?",
      timestamp: Date.now()
    }]);
  };

  return (
    <Card className="flex flex-col h-[600px] bg-white/95 backdrop-blur-md border-0 shadow-xl shadow-orange-100/50 rounded-3xl overflow-hidden min-h-[600px]">
      <CardHeader className="border-b bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Campus NutriBot</CardTitle>
              <p className="text-xs text-white/80">Your AI nutrition assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearChat} className="text-white hover:bg-white/20">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

        <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-2">
                <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-slate-100 text-slate-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-100 rounded-tl-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

        <CardContent className="border-t p-4 bg-slate-50/50 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what you ate or ask for suggestions..."
            className="flex-1 rounded-full border-slate-200 bg-white h-12 px-5"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="rounded-full h-12 w-12 p-0 bg-orange-500 hover:bg-orange-600"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-3">
          {['What should I eat for lunch?', 'I had 2 dosas', 'Low calorie snacks?'].map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-orange-50 text-xs py-1 px-3 rounded-full border-slate-200"
              onClick={() => { setInput(suggestion); }}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
