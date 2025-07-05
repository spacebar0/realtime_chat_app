export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  user: User;
};

export type Room = {
  id: string;
  name: string;
  userCount: number;
  messages: Message[];
};
