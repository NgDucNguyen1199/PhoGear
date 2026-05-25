'use client'

import { useState, useEffect } from 'react'
import { Bell, ShoppingBag, MessageSquare, Zap, Info, CheckCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { getNotifications, markAsRead, markAllAsRead } from '@/actions/notifications'
import { createClient } from '@/lib/supabase/client'
import { cn, formatTimeAgo } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  const fetchNotifs = async () => {
    const data = await getNotifications()
    setNotifications(data)
    setUnreadCount(data.filter((n: any) => !n.is_read).length)
  }

  useEffect(() => {
    let channel: any

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      fetchNotifs()

      // Tạo một channel ID duy nhất cho lần mount này để tránh lỗi "after subscribe"
      const channelId = `notifications-${user.id}-${Math.random().toString(36).substring(2, 9)}`
      
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev])
            setUnreadCount((c) => c + 1)
          }
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const handleMarkAsRead = async (id: string, link?: string) => {
    await markAsRead(id)
    fetchNotifs()
    if (link) router.push(link)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    fetchNotifs()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_status': return <ShoppingBag className="h-4 w-4 text-blue-500" />
      case 'forum_reply': return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'flash_sale': return <Zap className="h-4 w-4 text-orange-500" />
      default: return <Info className="h-4 w-4 text-primary" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative transition-all hover:scale-110 active:scale-95"
          />
        }
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl overflow-hidden shadow-2xl border-white/5 bg-background/95 backdrop-blur-xl">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <h3 className="font-black uppercase tracking-tight text-xs flex items-center gap-2">
             Thông báo
          </h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-7 text-[10px] font-bold uppercase text-primary gap-1.5 hover:bg-primary/10">
              <CheckCheck size={12} /> Đọc tất cả
            </Button>
          )}
        </div>
        
        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id, notif.link)}
                className={cn(
                  "p-4 border-b last:border-0 cursor-pointer transition-all hover:bg-muted/50 flex gap-4 items-start relative",
                  !notif.is_read && "bg-primary/[0.03]"
                )}
              >
                <div className="mt-1 p-2 rounded-xl bg-background border shadow-sm">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={cn("text-sm leading-tight", !notif.is_read ? "font-bold" : "font-medium text-muted-foreground")}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notif.content}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                    {formatTimeAgo(new Date(notif.created_at))}
                  </p>
                </div>
                {!notif.is_read && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                )}
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 opacity-30">
              <Bell className="h-12 w-12" />
              <p className="text-xs font-black uppercase tracking-widest">Bạn chưa có thông báo mới</p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-muted/20 border-t text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                Xem tất cả lịch sử
            </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
