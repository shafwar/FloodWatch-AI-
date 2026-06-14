'use client';

import { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeatherChatPanel } from './WeatherChatPanel';

export function WeatherChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed z-50 bottom-6 right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(600px,calc(100vh-3rem))]">
        <WeatherChatPanel variant="floating" onClose={() => setIsOpen(false)} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        onClick={() => setIsOpen(true)}
        className="h-14 w-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        id="chat-toggle-btn"
      >
        <MessageCircle size={22} />
      </Button>
      <span className="absolute -top-1 -right-1 flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40" />
        <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
          <Sparkles size={10} className="text-primary-foreground" />
        </span>
      </span>
    </div>
  );
}
