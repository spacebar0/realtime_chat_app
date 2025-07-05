import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatHeader } from "@/components/chat/chat-header"
import { popularRooms, recentRooms, rooms } from "@/lib/mock-data"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  // In a real app, you'd fetch this data
  const allRoomsData = rooms;
  const popularRoomsData = popularRooms;
  const recentRoomsData = recentRooms;

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
