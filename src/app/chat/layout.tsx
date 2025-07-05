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
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <ChatSidebar 
                allRooms={allRoomsData} 
                popularRooms={popularRoomsData} 
                recentRooms={recentRoomsData}
            />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <ChatHeader />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  )
}
