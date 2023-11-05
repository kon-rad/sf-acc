import { sendMessage } from "@/lib/utils/sendMessage";
import { ChatCompletionRequestMessage } from "openai";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ContextProps {
  messages: ChatCompletionRequestMessage[];
  addMessage: (content: string, videoId: string) => Promise<void>;
  isLoadingAnswer: boolean;
}

const ChatsContext = createContext<Partial<ContextProps>>({});

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage: ChatCompletionRequestMessage = {
        role: "system",
        content:
          "You are a San Francisco city official. Answer all questions helfpully and kindly.",
      };
      const welcomeMessage: ChatCompletionRequestMessage = {
        role: "assistant",
        content: "Hey, how are you doing today?",
      };
      setMessages([systemMessage, welcomeMessage]);
    };

    // When no messages are present, we initialize the chat the system message and the welcome message
    // We hide the system message from the user in the UI
    if (!messages?.length) {
      initializeChat();
    }
  }, [messages?.length, setMessages]);

  const addMessage = async (content: string, videoId: string) => {
    setIsLoadingAnswer(true);
    try {
      const newMessage: ChatCompletionRequestMessage = {
        role: "user",
        content,
      };
      console.log("sending  message: ", content);
      const newMessages = [...messages, newMessage];

      setMessages(newMessages);

      await sendMessage(newMessages, setMessages, newMessages, videoId);
    } catch (error) {
      console.error("hi error: ", error);
      // Show error when something goes wrong
      // addToast({ title: "An error occurred", type: "error" });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  );
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps;
};
