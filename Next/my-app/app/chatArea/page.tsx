"use client";

import { useState, useEffect, useRef } from "react";
import { useMessageContext } from "../context/context";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ChatArea({ io, selection }: { io: WebSocket; selection: any }) {
    const [messages, setMessages] = useState<Map<string, Array<any>>>(new Map());
    const messagesRef = useRef(new Map<string, Array<any>>()); // Local state to avoid excessive re-renders
    const Message = useMessageContext();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        console.log(Message);

        const handleMessage = (event: MessageEvent) => {
            manageMessage(event.data);
        };

        io.addEventListener("message", handleMessage);

        return () => {
            io.removeEventListener("message", handleMessage); // Cleanup to avoid memory leaks
        };
    }, []);

    const manageMessage = (message: any) => {
        Message.MessageObj.messages(JSON.parse(message)); // Update global messages

        const msgMap = Message.MessageObj.getPeerMessages(selection);

        let updated = false; // Track if changes happened
        msgMap.forEach((value: Array<any>, key: string) => {
            if (JSON.stringify(messagesRef.current.get(key)) !== JSON.stringify(value)) {
                messagesRef.current.set(key, value);
                updated = true;
            }
        });

        if (updated) {
            setMessages(new Map(messagesRef.current)); // Only update if there is a change
        }
    };

    const handleSend = () => {
        if (!textAreaRef.current?.value) return;

        const msg = {
            recipient: selection,
            sender: "japjeet",
            chat: textAreaRef.current.value,
            timestamps: new Date(),
        };

        io.send(JSON.stringify(msg));
        textAreaRef.current.value = "";
    };

    return (
        <div className="chatArea">
            <div className="z-10 mb-18 h-full flex w-full flex-1 flex-col-reverse gap-4 p-4 message-container">
                {Array.from(messages.entries()).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 aspect-video h-12 w-full rounded-lg">
                        {JSON.stringify(value)}
                    </div>
                ))}
            </div>
            <div className="chatArea__input">
                <Textarea placeholder="Type your message here." className="w-full" ref={textAreaRef} />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    );
}
