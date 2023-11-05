import React from "react";
import { useMessages } from "@/lib/hooks/useMessages";
import styles from "./MessagesList.module.css";
import SpeechPlayer from "@/lib/components/SpeechPlayer";

import { Accordion } from "flowbite-react";
const MessagesList = ({ setStatus, status }: any) => {
  const { messages, isLoadingAnswer } = useMessages();
  console.log("messages list messages: ", messages);
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };
  const renderTextOrLink = (text: string): JSX.Element => {
    if (isValidUrl(text)) {
      // Return text as an anchor tag if it's a valid URL
      return (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue" }}
        >
          {text}
        </a>
      );
    } else {
      // Return text as a span if it's not a valid URL
      return <span>{text}</span>;
    }
  };
  const removeUrls = (text) => {
    // Regular expression to match URLs
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    // Replace URLs with an empty string
    return text.replace(urlRegex, "");
  };
  const convertTextToElements = (text) => {
    if (!text) return [];

    // Remove " characters and replace \n with actual new line breaks
    text = text.replace(/"/g, "").replace(/\\n/g, "\n");

    const lines = text.split("\n");
    const elements = lines.flatMap((line, lineIndex) => {
      const markdownLinkRegex = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
      const markdownImageRegex = /!\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;

      const lineWithImages = line.replace(
        markdownImageRegex,
        (match, alt, url) =>
          `<img alt="${alt}" src="${url}" style="max-width:100%;"/>`
      );

      const parts = lineWithImages.split(markdownLinkRegex);
      const lineElements = [];

      for (let i = 0; i < parts.length; i += 3) {
        if (parts[i].includes("<img")) {
          const imageMarkup = { __html: parts[i] };
          lineElements.push(
            <div
              key={`${lineIndex}-img-${i}`}
              dangerouslySetInnerHTML={imageMarkup}
            />
          );
        } else {
          lineElements.push(renderTextOrLink(parts[i]));
        }

        const text = parts[i + 1];
        const url = parts[i + 2];

        if (text && url) {
          lineElements.push(
            <a
              key={`${lineIndex}-${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              {text}
            </a>
          );
        }
      }

      if (lineIndex < lines.length - 1) {
        lineElements.push(<br key={`br-${lineIndex}`} />);
      }

      return lineElements;
    });

    return elements;
  };
  const getAgentAvatar = (role: string) => {
    if (role === "news") {
      return "/assets/images/reporter.png";
    } else if (role === "mayor") {
      return "/assets/images/mayor.png";
    } else if (role === "ilya") {
      return "/assets/images/ilya.png";
    } else {
      return "/assets/images/ilya.png";
    }
  };

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
                src={getAgentAvatar(message.role)}
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
              {convertTextToElements(message.content?.trim())}
              {!isUser &&
                !isLoadingAnswer &&
                message.content?.trim() &&
                i === messages.length - 1 && (
                  <div className="flex flex-col my-2 pp-2">
                    <SpeechPlayer
                      textBody={removeUrls(message.content?.trim())}
                      voice={message.role}
                    />
                  </div>
                )}
              <div className="flex flex-col w-full">
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
                              {renderTextOrLink(item.metadata.source)}
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
            src="/assets/images/ilya.png"
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
