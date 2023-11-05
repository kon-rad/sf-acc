import { useMessages } from "@/lib/hooks/useMessages";
import { Button, TextArea } from "@apideck/components";
import { useEffect, useState } from "react";
import { MicButton } from "@/lib/components/MicButton";
import { useSupabase } from "@/lib/context/SupabaseProvider";

const MessageForm = () => {
  const [content, setContent] = useState("");
  // const [exampleQuestions, setExampleQuestions] = useState<any>();
  const { session } = useSupabase();
  const { addMessage } = useMessages();

  if (!session?.user.id) {
    alert("please login /login");
  }
  const userId = session?.user.id;
  console.log("session: ", userId);
  useEffect(() => {
    const fetchData = async () => {
      // const response = await axios.post("/api/agent/chat", {
      //   userId: userId,
      // });
      // console.log("example chat response: ", response);
      // if (response.error) {
      //   console.error(response.error);
      // } else if (response.data && response.data.exampleQuestions) {
      //   setExampleQuestions(response.data.exampleQuestions);
      // }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();
    addMessage(content, userId);
    setContent("");
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <form
      className="relative mx-auto w-full rounded-t-xl"
      onSubmit={handleSubmit}
    >
      <div className=" border-gray-200 rounded-t-xl backdrop-blur border-t border-l border-r border-gray-500/10 bg-white supports-backdrop-blur:bg-white/95 p-5">
        <label htmlFor="content" className="sr-only">
          Your message
        </label>
        <TextArea
          name="content"
          placeholder="your message here"
          rows={3}
          value={content}
          autoFocus
          className="!p-3 text-gray-900 border-0 ring-1 ring-gray-300/40 focus:ring-gray-300/80 focus:outline-none  backdrop-blur shadow-none"
          onChange={(e: any) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="absolute right-8 bottom-10">
          <div className="flex space-x-3 text-black">
            <Button className="black text-black" type="submit" size="small">
              <p className="text-black dark:text-white">send</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-1 text-black dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </Button>
            <MicButton setMessage={setContent} currentMessage={content} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageForm;
