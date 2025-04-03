"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/app/components/ChatWidget"), {
  ssr: false,
  loading: () => null,
});

export default function ClientChatWrapper() {
  return <ChatWidget recipientId={1} recipientName="Admin" />;
}
