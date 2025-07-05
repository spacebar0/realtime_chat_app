"use client"

import { useState, useEffect, useRef } from "react"
import type { Room, Message } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useUser } from "@/context/user-context"
import { useRoom } from "@/context/room-context"

export function ChatView({ roomId }: { roomId: string }) {
  const { currentUser } = useUser()
  const { rooms, sendMessage } = useRoom()
  const room = rooms.find(r => r.id === roomId) || null
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    }
  }, [room?.messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !room || !currentUser) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      user: currentUser,
    }

    await sendMessage(roomId, message)
    setNewMessage("")
  }

  if (!currentUser) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p>Authenticating...</p>
        </div>
      </Card>
    )
  }
  
  if (!room) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
            <p>Room not found.</p>
            <p>Select a room from the sidebar.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle># {room.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{room.userCount} users online</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-6 space-y-4">
            {room.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.user.id === currentUser.id && "flex-row-reverse"
                )}
              >
                <Avatar className="h-8 w-8" data-ai-hint="avatar">
                  <AvatarImage src={message.user.avatar} />
                  <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={cn("flex flex-col max-w-xs md:max-w-md", message.user.id === currentUser.id && "items-end")}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg",
                    message.user.id === currentUser.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={!currentUser}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
