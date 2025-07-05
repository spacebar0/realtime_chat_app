"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar"
import { MessageSquare, Star, History, Hash, Bot } from "lucide-react"
import { CreateRoomDialog } from "./create-room-dialog"
import type { Room } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatSidebarProps {
  popularRooms: Room[];
  recentRooms: Room[];
  allRooms: Room[];
}

export function ChatSidebar({ popularRooms, recentRooms, allRooms }: ChatSidebarProps) {
  const pathname = usePathname()

  const isActive = (roomId: string) => {
    return pathname === `/chat/room/${roomId}`
  }

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Bot size={24} />
            <h1 className="text-xl font-semibold">Zync</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
            <SidebarMenu>
                <SidebarMenuItem>
                    <CreateRoomDialog />
                </SidebarMenuItem>
                <SidebarSeparator />
                <SidebarMenuItem>
                    <h2 className="px-2 pt-2 text-xs font-semibold text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4" /> Popular Rooms</h2>
                    <SidebarMenu>
                        {popularRooms.map(room => (
                            <SidebarMenuItem key={room.id}>
                                <Link href={`/chat/room/${room.id}`} passHref>
                                    <SidebarMenuButton isActive={isActive(room.id)} className="w-full justify-start" tooltip={room.name}>
                                        <Hash className="w-4 h-4" />
                                        <span className="truncate">{room.name}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarMenuItem>
                <SidebarSeparator />
                <SidebarMenuItem>
                    <h2 className="px-2 pt-2 text-xs font-semibold text-muted-foreground flex items-center gap-2"><History className="w-4 h-4" /> Recent Rooms</h2>
                    <SidebarMenu>
                        {recentRooms.map(room => (
                            <SidebarMenuItem key={room.id}>
                                <Link href={`/chat/room/${room.id}`} passHref>
                                    <SidebarMenuButton isActive={isActive(room.id)} className="w-full justify-start" tooltip={room.name}>
                                        <Hash className="w-4 h-4" />
                                        <span className="truncate">{room.name}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarMenuItem>
                <SidebarSeparator />
                <SidebarMenuItem>
                    <h2 className="px-2 pt-2 text-xs font-semibold text-muted-foreground flex items-center gap-2"><MessageSquare className="w-4 h-4" /> All Rooms</h2>
                    <SidebarMenu>
                        {allRooms.map(room => (
                            <SidebarMenuItem key={room.id}>
                                <Link href={`/chat/room/${room.id}`} passHref>
                                    <SidebarMenuButton isActive={isActive(room.id)} className="w-full justify-start" tooltip={room.name}>
                                        <Hash className="w-4 h-4" />
                                        <span className="truncate">{room.name}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
