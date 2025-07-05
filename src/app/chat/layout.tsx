"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatHeader } from "@/components/chat/chat-header"
import { recentRooms as mockRecentRooms } from "@/lib/mock-data"
import { useRoom } from "@/context/room-context"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { rooms } = useRoom();

  const allRoomsData = rooms;
  const popularRoomsData = [...rooms].sort((a, b) => b.userCount - a.userCount).slice(0, 5);
  // Keep recent rooms mock for now as we don't track participation
  const recentRoomsData = mockRecentRooms.map(rr => rooms.find(r => r.id === rr.id) || rr).slice(0, 5);


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
