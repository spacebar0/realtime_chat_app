import { ChatView } from "@/components/chat/chat-view"

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  return <ChatView roomId={params.id} />
}
