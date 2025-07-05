"use client"

import { useState, useEffect, useRef } from "react"
import { getRoomById, currentUser, rooms } from "@/lib/mock-data"
import type { Room, Message } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export function ChatView({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const roomData = getRoomById(roomId)
    if (roomData) {
      setRoom(roomData)
      setMessages(roomData.messages)
    }
  }, [roomId])
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !room) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      user: currentUser,
    }

    setMessages([...messages, message])
    
    // This is a mock implementation, in a real app you'd update a database
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      rooms[roomIndex].messages.push(message);
    }

    setNewMessage("")
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
            {messages.map((message) => (
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
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
