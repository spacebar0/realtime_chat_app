"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useRoom } from "@/context/room-context"

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false)
  const [roomName, setRoomName] = useState("")
  const { toast } = useToast()
  const { addRoom } = useRoom()

  const handleCreateRoom = async () => {
    if (roomName.trim().length > 2) {
      const success = await addRoom(roomName)
      if (success) {
        setOpen(false)
        setRoomName("")
      }
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Name",
            description: "Room name must be at least 3 characters long.",
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton variant="outline" className="w-full justify-start" tooltip="Create Room">
            <PlusCircle />
            <span>Create Room</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new room</DialogTitle>
          <DialogDescription>
            Give your new room a name. You can invite others to join later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Anime Fans"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateRoom}>Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
