import type { Room, User, Message } from './types';

export const users: User[] = [
  { id: '1', name: 'Alice', avatar: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob', avatar: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie', avatar: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'David', avatar: 'https://placehold.co/40x40.png' },
  { id: '5', name: 'Eve', avatar: 'https://placehold.co/40x40.png' },
  { id: '6', name: 'Frank', avatar: 'https://placehold.co/40x40.png' },
];

const generateMessages = (roomId: string, count: number): Message[] => {
  return Array.from({ length: count }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    return {
      id: `${roomId}-msg-${i}`,
      text: `This is message ${i} in room ${roomId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
      user,
    };
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const rooms: Room[] = [
  { id: '1', name: 'general', userCount: 42, messages: generateMessages('1', 15) },
  { id: '2', name: 'random', userCount: 18, messages: generateMessages('2', 10) },
  { id: '3', name: 'tech-talk', userCount: 25, messages: generateMessages('3', 20) },
  { id: '4', name: 'design-corner', userCount: 12, messages: generateMessages('4', 8) },
  { id: '5', name: 'gaming-lounge', userCount: 56, messages: generateMessages('5', 30) },
  { id: '6', name: 'music-cafe', userCount: 31, messages: generateMessages('6', 12) },
];

export const recentRooms: Room[] = [rooms[4], rooms[2], rooms[0], rooms[1], rooms[3]];
