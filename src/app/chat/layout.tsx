"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatHeader } from "@/components/chat/chat-header"
import { useRoom } from "@/context/room-context"
import { useUser } from "@/context/user-context"
import { Loader2 } from "lucide-react"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { rooms, loading: roomsLoading } = useRoom()
  const { currentUser, loading: userLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!userLoading && !currentUser) {
      router.replace('/login')
    }
  }, [userLoading, currentUser, router]);

  const allRoomsData = [...rooms].sort((a, b) => a.name.localeCompare(b.name));
  const popularRoomsData = [...rooms].sort((a, b) => b.userCount - a.userCount).slice(0, 5);
  const recentRoomsData = rooms.slice(0, 5);

  if (userLoading || roomsLoading || !currentUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="text-center text-muted-foreground flex items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading your session...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <ChatSidebar 
                allRooms={allRoomsData} 
                popularRooms={popularRoomsData} 
                recentRooms={recentRoomsData}
            />
            <div className="flex flex-1 flex-col">
                <ChatHeader />
                <main className="flex-1 p-4 sm:px-6">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  )
}
