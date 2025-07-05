
"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Room, Message } from '@/lib/types';
import { rooms as initialRooms } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  query, 
  writeBatch, 
  runTransaction, 
  Timestamp,
  orderBy
} from 'firebase/firestore';

const ROOM_CREATION_LIMIT = 10;
const ROOM_CREATION_TIMEFRAME = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_CONFIG_ID = 'roomCreationRateLimit';

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  addRoom: (roomName: string) => Promise<boolean>;
  getRoomById: (id: string) => Room | undefined;
  sendMessage: (roomId: string, message: Message) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "rooms"), orderBy("name"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty && querySnapshot.metadata.fromCache === false) {
        console.log("No rooms found. Seeding database...");
        const batch = writeBatch(db);
        initialRooms.forEach(room => {
            const roomWithTimestamp = {
                ...room,
                createdAt: Timestamp.now()
            };
            const roomRef = doc(collection(db, 'rooms'));
            batch.set(roomRef, roomWithTimestamp);
        });
        await batch.commit();
        console.log("Database seeded.");
      } else {
        const roomsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Room));
        setRooms(roomsData);
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching rooms:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch chat rooms. Please check your Firebase configuration in src/lib/firebase.ts.",
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addRoom = useCallback(async (roomName: string): Promise<boolean> => {
    const rateLimitRef = doc(db, 'config', RATE_LIMIT_CONFIG_ID);

    try {
      let newRoomId = '';
      await runTransaction(db, async (transaction) => {
        const rateLimitDoc = await transaction.get(rateLimitRef);
        
        const now = Timestamp.now();
        let timestamps: Timestamp[] = [];

        if (rateLimitDoc.exists()) {
          timestamps = rateLimitDoc.data().timestamps || [];
        }
        
        const oneHourAgo = Date.now() - ROOM_CREATION_TIMEFRAME;
        const recentTimestamps = timestamps.filter(ts => ts.toMillis() > oneHourAgo);

        if (recentTimestamps.length >= ROOM_CREATION_LIMIT) {
          throw new Error("Rate limit exceeded");
        }

        const newRoomData = {
          name: roomName,
          userCount: 1,
          messages: [],
          createdAt: now,
        };
        const newRoomRef = doc(collection(db, 'rooms'));
        transaction.set(newRoomRef, newRoomData);
        newRoomId = newRoomRef.id;

        const newTimestamps = [...recentTimestamps, now];
        transaction.set(rateLimitRef, { timestamps: newTimestamps }, { merge: true });
      });

      toast({
        title: "Room Created!",
        description: `The room "${roomName}" has been successfully created.`,
      });
      router.push(`/chat/room/${newRoomId}`);
      return true;
    } catch (e: any) {
      if (e.message === "Rate limit exceeded") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Room could not be created due to servers being too busy.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create room. Please check console for details.",
        });
        console.error("Transaction failed: ", e);
      }
      return false;
    }
  }, [router, toast]);

  const getRoomById = useCallback((id: string): Room | undefined => {
    return rooms.find(room => room.id === id);
  }, [rooms]);

  const sendMessage = useCallback(async (roomId: string, message: Message) => {
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    try {
      await updateDoc(roomRef, {
        messages: arrayUnion(message)
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send message.",
      });
    }
  }, [toast]);

  return (
    <RoomContext.Provider value={{ rooms, loading, addRoom, getRoomById, sendMessage }}>
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
