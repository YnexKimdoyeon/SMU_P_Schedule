"use client"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, UserPlus, MessageSquare, CheckCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/app/page"

interface NotificationsPopoverProps {
  notifications: Notification[]
  onMarkAllAsRead: () => void
}

const notificationIcons = {
  mention: <UserPlus className="h-4 w-4 text-blue-500" />,
  assignment: <UserPlus className="h-4 w-4 text-green-500" />,
  comment: <MessageSquare className="h-4 w-4 text-purple-500" />,
}

export function NotificationsPopover({ notifications, onMarkAllAsRead }: NotificationsPopoverProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative bg-transparent transition-all duration-200 hover:scale-110"
        >
          <Bell className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500 text-white animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="font-semibold">알림</h3>
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            모두 읽음
          </Button>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="unread">읽지 않음</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-72">
            <TabsContent value="all" className="p-4 space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 p-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${!n.isRead ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  {notificationIcons[n.type]}
                  <div>
                    <p className="text-sm">{n.content}</p>
                    <p className="text-xs text-muted-foreground">{new Date(n.timestamp).toLocaleString("ko-KR")}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="unread" className="p-4 space-y-2">
              {notifications
                .filter((n) => !n.isRead)
                .map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 p-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${!n.isRead ? "bg-muted" : "hover:bg-muted/50"}`}
                  >
                    {notificationIcons[n.type]}
                    <div>
                      <p className="text-sm">{n.content}</p>
                      <p className="text-xs text-muted-foreground">{new Date(n.timestamp).toLocaleString("ko-KR")}</p>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
