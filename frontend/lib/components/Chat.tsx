import MessageForm from "@/lib/components/messages/MessageForm";
import MessagesList from "@/lib/components/messages/MessagesList";

const Chat = () => {
  return (
    <div className="flex flex-col h-full bg-white border-left border-gray-700">
      <MessagesList />
      <div className="">
        <MessageForm />
      </div>
    </div>
  );
};

export default Chat;
