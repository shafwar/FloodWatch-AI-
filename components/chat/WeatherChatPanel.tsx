'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  Cloud,
  MapPin,
  CloudRain,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useWeatherStore } from '@/store/weatherStore';
import { useWeatherChat, SUGGESTED_QUESTIONS } from '@/hooks/useWeatherChat';
import { useMobileChatViewport } from '@/hooks/useMobileChatViewport';

const HOME_ACTIONS: { label: string; question: string; icon: LucideIcon }[] = [
  { label: 'Cuaca Semarang Utara', question: SUGGESTED_QUESTIONS[0], icon: Cloud },
  { label: 'Wilayah risiko banjir', question: SUGGESTED_QUESTIONS[1], icon: MapPin },
  { label: 'Prakiraan 3 jam', question: SUGGESTED_QUESTIONS[2], icon: CloudRain },
];

function formatChatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

interface WeatherChatPanelProps {
  variant?: 'embedded' | 'floating';
  spotlight?: boolean;
  className?: string;
  onClose?: () => void;
  onActivityChange?: (state: { hasConversation: boolean; isLoading: boolean }) => void;
}

export function WeatherChatPanel({
  variant = 'embedded',
  spotlight = false,
  className,
  onClose,
  onActivityChange,
}: WeatherChatPanelProps) {
  const isEmbedded = variant === 'embedded';
  const meta = useWeatherStore((s) => s.meta);
  const isWeatherLoading = useWeatherStore((s) => s.isLoading);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    bottomRef,
    scrollAreaRef,
    sendMessage,
    resetChat,
    scrollToBottom,
    hasConversation,
  } = useWeatherChat();

  const isHome = spotlight && !hasConversation;
  const { isMobile, keyboardInset } = useMobileChatViewport(isEmbedded && spotlight);

  useEffect(() => {
    onActivityChange?.({ hasConversation, isLoading });
  }, [hasConversation, isLoading, onActivityChange]);

  useEffect(() => {
    if (!isHome) {
      requestAnimationFrame(() => scrollToBottom());
    }
  }, [messages, isLoading, scrollToBottom, isHome]);

  useEffect(() => {
    if (!isEmbedded || isHome || isMobile) return;
    inputRef.current?.focus();
  }, [isEmbedded, isHome, isMobile]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const statusText = isWeatherLoading
    ? 'Memuat data BMKG...'
    : meta?.bmkgStatus === 'online'
      ? `BMKG · ${meta.locationsOnline}/${meta.locationsTotal} lokasi`
      : meta?.bmkgStatus === 'degraded'
        ? 'Hybrid BMKG + CSV'
        : 'CSV fallback';

  const visibleMessages = messages.filter(
    (msg) => !(spotlight && !hasConversation && msg.id === 'welcome')
  );

  const inputBox = (
    <div
      className={cn(
        'flex items-end gap-2 w-full transition-all',
        spotlight
          ? 'rounded-[26px] bg-muted/40 border border-border/70 px-4 py-3 shadow-sm focus-within:border-border focus-within:bg-muted/55'
          : 'rounded-2xl border border-border bg-background/80 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/25'
      )}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (isMobile && hasConversation) {
            requestAnimationFrame(() => scrollToBottom());
          }
        }}
        placeholder={spotlight ? 'Tanya apa saja tentang cuaca Semarang...' : 'Tanya cuaca atau risiko banjir...'}
        rows={1}
        disabled={isLoading}
        className={cn(
          'flex-1 resize-none bg-transparent border-0 outline-none chat-input-field',
          'placeholder:text-muted-foreground',
          'disabled:opacity-50 max-h-28 scrollbar-thin',
          spotlight ? 'py-1 min-h-[24px]' : 'py-1.5 min-h-[36px]'
        )}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${Math.min(target.scrollHeight, spotlight ? 112 : 96)}px`;
        }}
      />
      <Button
        size="icon-sm"
        onClick={() => sendMessage(input)}
        disabled={!input.trim() || isLoading}
        className={cn('shrink-0', spotlight ? 'rounded-full size-8' : 'rounded-xl')}
        id="chat-send-btn"
      >
        {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
      </Button>
    </div>
  );

  const useNativeScroll = spotlight || isMobile;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden',
        isHome ? 'flex-1 justify-center min-h-0' : 'flex-1 min-h-0 h-full',
        !spotlight && isEmbedded && 'rounded-2xl border border-border bg-card/80 backdrop-blur-sm h-full',
        !spotlight && !isEmbedded && 'rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 h-full',
        className
      )}
    >
      {/* Standard header */}
      {!spotlight && (
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 border-b border-border shrink-0',
            isEmbedded ? 'bg-gradient-to-r from-primary/8 via-transparent to-transparent' : 'bg-gradient-to-r from-primary/10 to-transparent'
          )}
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 border border-primary/20">
            <Bot size={18} className="text-primary" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm leading-tight">AQUA Assistant</h3>
              <Sparkles size={12} className="text-primary/70" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate">{statusText}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={resetChat} title="Mulai ulang">
              <RotateCcw size={14} />
            </Button>
            {!isEmbedded && onClose && (
              <Button variant="ghost" size="icon-sm" onClick={onClose} id="chat-close-btn">
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ChatGPT-style home */}
      {isHome ? (
        <div className="flex flex-col items-center justify-center px-4 py-8 w-full max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-[1.75rem] font-medium text-foreground text-center mb-8 tracking-tight"
          >
            Apa yang ingin Anda ketahui?
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="w-full"
          >
            {inputBox}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mt-4 w-full"
          >
            {HOME_ACTIONS.map(({ label, question, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(question)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-border/70',
                  'px-4 py-2 text-sm text-muted-foreground',
                  'hover:bg-muted/50 hover:text-foreground hover:border-border',
                  'transition-colors duration-200'
                )}
              >
                <Icon size={14} className="shrink-0 opacity-70" />
                {label}
              </button>
            ))}
          </motion.div>

          {error && (
            <p className="mt-4 text-xs text-destructive text-center">{error}</p>
          )}

          <p className="mt-6 text-[11px] text-muted-foreground/60">{statusText}</p>
        </div>
      ) : (
        <>
          {/* Chat header when in conversation (spotlight) */}
          {spotlight && hasConversation && (
            <div className="flex items-center justify-between px-4 py-2 shrink-0 border-b border-border/40">
              <span className="text-xs text-muted-foreground">AQUA Assistant</span>
              <Button variant="ghost" size="icon-sm" onClick={resetChat} title="Percakapan baru">
                <RotateCcw size={14} />
              </Button>
            </div>
          )}

          <div
            ref={useNativeScroll ? scrollAreaRef : undefined}
            data-chat-scroll={useNativeScroll ? 'native' : undefined}
            className={cn(
              'flex-1 min-h-0',
              useNativeScroll
                ? 'overflow-y-auto chat-messages-scroll'
                : 'flex flex-col overflow-hidden'
            )}
          >
            {useNativeScroll ? (
              <div className={cn('p-3 sm:p-4', spotlight && 'max-w-2xl mx-auto w-full')}>
                <div className="space-y-4 sm:space-y-5">
                  <AnimatePresence initial={false}>
                    {visibleMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          spotlight
                            ? msg.role === 'user'
                              ? 'flex justify-end'
                              : ''
                            : cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')
                        )}
                      >
                        {!spotlight && msg.role === 'assistant' && (
                          <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                            <Bot size={14} className="text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'text-sm leading-relaxed',
                            spotlight
                              ? msg.role === 'user'
                                ? 'max-w-[92%] sm:max-w-[85%] rounded-3xl bg-muted/60 px-4 py-2.5 text-foreground'
                                : 'max-w-full text-foreground/90 py-1'
                              : cn(
                                  'max-w-[88%] rounded-2xl px-3.5 py-2.5',
                                  msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : 'bg-muted/50 text-foreground rounded-tl-sm border border-border/40'
                                )
                          )}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {renderMessageContent(msg.content)}
                          </div>
                          {msg.timestamp && !spotlight && (
                            <p
                              className={cn(
                                'text-[10px] mt-1.5',
                                msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                              )}
                            >
                              {formatChatTime(msg.timestamp)}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', spotlight && 'py-2')}>
                      {!spotlight && (
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot size={14} className="text-primary" />
                        </div>
                      )}
                      <Loader2 size={14} className="animate-spin" />
                      <span>Menganalisis data cuaca...</span>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 min-h-0 h-full">
                <div className="p-4">
                  <div className="space-y-5">
                    <AnimatePresence initial={false}>
                      {visibleMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                        >
                          {msg.role === 'assistant' && (
                            <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                              <Bot size={14} className="text-primary" />
                            </div>
                          )}
                          <div
                            className={cn(
                              'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                : 'bg-muted/50 text-foreground rounded-tl-sm border border-border/40'
                            )}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {renderMessageContent(msg.content)}
                            </div>
                            {msg.timestamp && (
                              <p
                                className={cn(
                                  'text-[10px] mt-1.5',
                                  msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                                )}
                              >
                                {formatChatTime(msg.timestamp)}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot size={14} className="text-primary" />
                        </div>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Menganalisis data cuaca...</span>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>

          {error && (
            <div className="mx-4 mb-2 flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 shrink-0">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div
            className={cn(
              'shrink-0 bg-background/95 backdrop-blur-sm',
              spotlight ? 'px-3 sm:px-4 pt-2 pb-safe max-w-2xl mx-auto w-full' : 'p-3 border-t border-border bg-muted/10'
            )}
            style={
              isMobile && keyboardInset > 0
                ? { paddingBottom: `max(0.75rem, calc(env(safe-area-inset-bottom, 0px) + ${keyboardInset}px))` }
                : undefined
            }
          >
            {inputBox}
            {!spotlight && (
              <p className="text-[10px] text-muted-foreground text-center mt-2">BMKG · Gemini AI</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
