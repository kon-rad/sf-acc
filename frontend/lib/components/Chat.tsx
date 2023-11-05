import MessageForm from "@/lib/components/messages/MessageForm";
import MessagesList from "@/lib/components/messages/MessagesList";
import { useState } from "react";

const Chat = () => {
  const [status, setStatus] = useState<string>("");
  return (
    <div className="flex flex-col h-full bg-white border-left border-gray-700">
      <MessagesList setStatus={setStatus} status={status} />
      <div className="">
        <MessageForm setStatus={setStatus} />
      </div>
    </div>
  );
};

export default Chat;
