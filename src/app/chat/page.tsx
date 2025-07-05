import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
             <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="flex flex-col items-center justify-center gap-4">
                        <MessageSquare className="w-16 h-16 text-primary" />
                        Welcome to ChitChat Hub!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Select a room from the sidebar to start a conversation, or create a new one.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
