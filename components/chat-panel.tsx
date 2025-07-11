"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, Hash, MessageCircle, Smile, Paperclip } from "lucide-react"

interface ChatPanelProps {
  projectId: string
  onReadMessages?: (chatId: string) => void
}

interface ChatMessage {
  id: string
  author: string
  content: string
  timestamp: string
  channel: string
}

interface ChatChannel {
  id: string
  name: string
  type: "channel" | "dm"
  unreadCount: number
}

const mockChannels: ChatChannel[] = [
  { id: "general", name: "일반", type: "channel", unreadCount: 0 },
  { id: "project-updates", name: "프로젝트-업데이트", type: "channel", unreadCount: 3 },
  { id: "random", name: "자유", type: "channel", unreadCount: 0 },
]

const mockDMs: ChatChannel[] = [
  { id: "john-doe", name: "김철수", type: "dm", unreadCount: 2 },
  { id: "jane-smith", name: "이영희", type: "dm", unreadCount: 0 },
  { id: "park-minsu", name: "박민수", type: "dm", unreadCount: 1 },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    author: "김철수",
    content: "팀 여러분, 홈페이지 와이어프레임을 완성했습니다!",
    timestamp: "2025-01-10T10:30:00Z",
    channel: "general",
  },
  {
    id: "2",
    author: "이영희",
    content: "좋은 작업이네요! 프로젝트 채널에 공유해 주실 수 있나요?",
    timestamp: "2025-01-10T10:32:00Z",
    channel: "general",
  },
  {
    id: "3",
    author: "박민수",
    content: "인증 시스템이 거의 테스트 준비가 완료되었습니다",
    timestamp: "2025-01-10T11:15:00Z",
    channel: "project-updates",
  },
]

const dmMessages: ChatMessage[] = [
  {
    id: "dm1",
    author: "김철수",
    content: "안녕하세요! 프로젝트 관련해서 질문이 있어서 연락드렸습니다.",
    timestamp: "2025-01-10T14:20:00Z",
    channel: "john-doe",
  },
  {
    id: "dm2",
    author: "Current User",
    content: "네, 말씀하세요!",
    timestamp: "2025-01-10T14:22:00Z",
    channel: "john-doe",
  },
  {
    id: "dm3",
    author: "박민수",
    content: "API 문서 검토 완료했습니다.",
    timestamp: "2025-01-10T15:10:00Z",
    channel: "park-minsu",
  },
]

export function ChatPanel({ projectId, onReadMessages }: ChatPanelProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([...mockMessages, ...dmMessages])
  const [isTyping, setIsTyping] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 추가될 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, selectedChat])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    setIsTyping(true)

    setTimeout(() => {
      const message: ChatMessage = {
        id: Date.now().toString(),
        author: "Current User",
        content: newMessage,
        timestamp: new Date().toISOString(),
        channel: selectedChat,
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")
      setIsTyping(false)
      setMessageSent(true)

      setTimeout(() => setMessageSent(false), 1000)
    }, 500)
  }

  const openChat = (chatId: string) => {
    setSelectedChat(chatId)
    // 채팅을 열면 해당 채팅의 읽지 않은 메시지 알림 삭제
    if (onReadMessages) {
      onReadMessages(chatId)
    }
  }

  const closeChat = () => {
    setSelectedChat(null)
    setNewMessage("")
  }

  const selectedChatInfo = [...mockChannels, ...mockDMs].find((ch) => ch.id === selectedChat)
  const chatMessages = messages
    .filter((msg) => msg.channel === selectedChat)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />팀 채팅
        </h3>
      </div>

      {/* Channel List */}
      <div className="p-4 border-b">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">채널</h4>
        <div className="space-y-1">
          {mockChannels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className="w-full justify-start h-8 transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:shadow-md"
              onClick={() => openChat(channel.id)}
            >
              <Hash className="h-4 w-4 mr-2 transition-all duration-200 hover:text-primary hover:rotate-12" />
              <span className="flex-1 text-left">{channel.name}</span>
              {channel.unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500 text-white"
                >
                  {channel.unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Team Members List */}
      <div className="flex-1 p-4">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">팀원</h4>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {mockDMs.map((dm) => (
              <Button
                key={dm.id}
                variant="ghost"
                className="w-full justify-start h-12 px-3 transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:shadow-lg group"
                onClick={() => openChat(dm.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-8 w-8 transition-all duration-200 group-hover:scale-110">
                      <AvatarFallback className="text-sm font-medium">
                        {dm.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm truncate transition-colors duration-200 group-hover:text-primary">
                      {dm.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {dm.id === "john-doe"
                        ? "안녕하세요! 프로젝트 관련해서..."
                        : dm.id === "park-minsu"
                          ? "API 문서 검토 완료했습니다."
                          : "온라인"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-muted-foreground">
                      {dm.id === "john-doe" ? "오후 2:30" : dm.id === "park-minsu" ? "오후 3:10" : "온라인"}
                    </div>
                    {dm.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500 text-white"
                      >
                        {dm.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Dialog */}
      <Dialog open={!!selectedChat} onOpenChange={(open) => !open && closeChat()}>
        <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
            <DialogTitle className="flex items-center gap-2">
              {selectedChatInfo?.type === "dm" ? (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {selectedChatInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedChatInfo.name}
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4" />
                  {selectedChatInfo?.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {chatMessages.map((message, index) => {
                const isCurrentUser = message.author === "Current User"
                const isPersonalMessage = selectedChatInfo?.type === "dm"

                if (isPersonalMessage) {
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isCurrentUser ? "justify-end" : ""} animate-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {message.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-xs`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString("ko-KR")}
                          </span>
                          {!isCurrentUser && <span className="text-sm font-medium">{message.author}</span>}
                        </div>
                        <div
                          className={`rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105 ${
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                      {isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">나</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={message.id}
                      className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString("ko-KR")}
                          </span>
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2 transition-all duration-200 hover:bg-muted/80 hover:scale-[1.02]">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}

              {isTyping && (
                <div className="flex gap-3 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-1 bg-muted rounded-lg px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">메시지 전송 중...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder={`${selectedChatInfo?.name}에게 메시지 보내기...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
              />
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSendMessage}
                className={`transition-all duration-300 hover:scale-110 ${
                  messageSent ? "bg-green-500 hover:bg-green-600" : ""
                }`}
                disabled={isTyping}
              >
                <Send
                  className={`h-4 w-4 transition-transform duration-200 ${
                    messageSent ? "scale-125" : "hover:translate-x-1"
                  }`}
                />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
