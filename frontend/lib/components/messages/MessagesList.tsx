import { useMessages } from "@/lib/hooks/useMessages";
import styles from "./MessagesList.module.css";
import SpeechPlayer from "@/lib/components/SpeechPlayer";

import { Accordion } from "flowbite-react";
const MessagesList = ({ setStatus, status }: any) => {
  const { messages, isLoadingAnswer } = useMessages();
  console.log("messages list messages: ", messages);

  return (
    <div className="max-w-screen-lg mx-auto pt-2 w-full overflow-y-scroll pr-4 h-full bg-white p-2">
      {messages?.map((message: any, i: number) => {
        const isUser = message.role === "user";
        if (message.role === "system") return null;
        return (
          <div
            id={`message-${i}`}
            className={`flex mb-4 fade-up ${
              isUser ? "justify-end" : "justify-start"
            } ${i === 1 ? "max-w-md" : ""}`}
            key={`chat-message-${i}`}
          >
            {!isUser && (
              <img
                src="/assets/images/jobs.png"
                className="w-9 h-9 rounded-full"
                alt="avatar"
              />
            )}
            <div
              style={{ maxWidth: "calc(100% - 45px)" }}
              className={`group relative px-3 py-2 rounded-lg ${
                isUser
                  ? "mr-2 bg-purple-100 from-primary-700 to-primary-600 text-black-800 dark:bg-blue-900 "
                  : "ml-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }`}
            >
              {message.content?.trim()}
              {!isUser &&
                !isLoadingAnswer &&
                message.content?.trim() &&
                i === messages.length - 1 && (
                  <div className="flex flex-col my-2 pp-2">
                    <SpeechPlayer textBody={message.content?.trim()} />
                  </div>
                )}
              <div className="flex flex-col w-full">
                {/* {!isUser && <AudioPlayer textBody={message.content.trim()} />} */}
                {message.sources && (
                  <Accordion collapseAll>
                    <Accordion.Panel>
                      <Accordion.Title className="px-2 py-1 rounded-xl">
                        sources
                      </Accordion.Title>
                      <Accordion.Content>
                        {message.sources.map((item: any, i: number) => (
                          <div key={`source-${i}`} className="p-2 rounded my-2">
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                              {item.pageContent}
                            </p>
                            <p className="text-xs mb-1 text-gray-400">
                              {item.metadata.source}
                            </p>
                          </div>
                        ))}
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                )}
              </div>
            </div>
            {isUser && (
              <img
                src="/assets/images/user-icon.png"
                className="w-9 h-9 rounded-full cursor-pointer"
                alt="avatar"
              />
            )}
          </div>
        );
      })}
      {isLoadingAnswer && (
        <div className="flex justify-start mb-4">
          <img
            src="/assets/images/jobs.png"
            className="w-9 h-9 rounded-full"
            alt="avatar"
          />
          <div className="ml-2 p-2.5 px-4 bg-gray-200 dark:bg-gray-800 rounded-lg space-x-1.5 flex justify-between items-center relative">
            <div className={styles.davinci_dots}>
              <div
                className={`${styles.davinci_dot} ${styles.davinci_dot_1}`}
              ></div>
              <div
                className={`${styles.davinci_dot} ${styles.davinci_dot_2}`}
              ></div>
              <div
                className={`${styles.davinci_dot} ${styles.davinci_dot_3}`}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
