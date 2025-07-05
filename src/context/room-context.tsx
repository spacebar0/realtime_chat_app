
"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Room, Message } from '@/lib/types';
import { rooms as initialRooms } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const ROOM_CREATION_LIMIT = 10;
const ROOM_CREATION_TIMEFRAME = 60 * 60 * 1000; // 1 hour in milliseconds
const ROOM_CREATION_TIMESTAMPS_KEY = 'roomCreationTimestamps';

interface RoomContextType {
  rooms: Room[];
  addRoom: (roomName: string) => void;
  getRoomById: (id: string) => Room | undefined;
  sendMessage: (roomId: string, message: Message) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const router = useRouter();
  const { toast } = useToast();

  const addRoom = useCallback((roomName: string) => {
    const now = Date.now();
    let timestamps: number[] = [];
    try {
        const storedTimestamps = localStorage.getItem(ROOM_CREATION_TIMESTAMPS_KEY);
        timestamps = storedTimestamps ? JSON.parse(storedTimestamps) : [];
    } catch (error) {
        console.error("Failed to parse timestamps from localStorage", error);
        timestamps = [];
    }

    const recentTimestamps = timestamps.filter(
      (ts) => now - ts < ROOM_CREATION_TIMEFRAME
    );

    if (recentTimestamps.length >= ROOM_CREATION_LIMIT) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Room could not be created due to servers being too busy.",
      });
      return;
    }

    const newRoom: Room = {
      id: String(Date.now()),
      name: roomName,
      userCount: 1,
      messages: [],
    };

    setRooms(prevRooms => [newRoom, ...prevRooms]);
    
    const newTimestamps = [...recentTimestamps, now];
    localStorage.setItem(ROOM_CREATION_TIMESTAMPS_KEY, JSON.stringify(newTimestamps));
    
    toast({
        title: "Room Created!",
        description: `The room "${roomName}" has been successfully created.`,
    });
    router.push(`/chat/room/${newRoom.id}`);
  }, [router, toast]);

  const getRoomById = useCallback((id: string): Room | undefined => {
    return rooms.find(room => room.id === id);
  }, [rooms]);

  const sendMessage = useCallback((roomId: string, message: Message) => {
    setRooms(prevRooms => {
        const newRooms = [...prevRooms];
        const roomIndex = newRooms.findIndex(r => r.id === roomId);
        if (roomIndex !== -1) {
            newRooms[roomIndex] = {
                ...newRooms[roomIndex],
                messages: [...newRooms[roomIndex].messages, message]
            };
        }
        return newRooms;
    });
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, addRoom, getRoomById, sendMessage }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
