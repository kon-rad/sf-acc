import { ChatCompletionRequestMessage } from "openai";

export const sendMessage = async (
  messages: ChatCompletionRequestMessage[],
  setMessages: any,
  newMessages: any,
  userId: string,
  setStatus: any
) => {
  try {
    setStatus("PENDING");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, userId }),
    });

    if (response.body === null) {
      console.error("error: ", response);
      throw new Error("error sending message");
    }

    if (response.status === 429) {
      console.error("error: ", response);
      throw new Error("error sending message");
    }
    let sourcesText = "";
    const sourcesHeader = response.headers.get("x-sources");
    const roleHeader = response.headers.get("x-role");
    let roleText = "";
    console.log("sourcesHeader: ", sourcesHeader);
    console.log("roleHeader: ", roleHeader);
    if (sourcesHeader) {
      const decodedString = atob(sourcesHeader);
      sourcesText = JSON.parse(decodedString);
      console.log("Sources Text:", sourcesText);
    } else if (roleHeader) {
      console.log("roleHeader: ", roleHeader);

      roleText = roleHeader;
      console.log("roleText Text:", roleText);
    } else {
      console.error("x-sources header is not present in the response");
    }
    await handleStream(
      response.body.getReader(),
      setMessages,
      newMessages,
      sourcesText,
      setStatus,
      roleText
    );
  } catch (error) {
    console.log(error);
  }
};

const handleStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  setMessages: any,
  newMessages: any,
  sources: any,
  setStatus: any,
  roleText: any
): Promise<void> => {
  let message = "";

  const handleStreamRecursively = async () => {
    const { done, value } = await reader.read();

    const text = new TextDecoder().decode(value);

    message += text;

    if (done) {
      setStatus("READY");
      return;
    }
    setMessages([
      ...newMessages,
      { content: message, role: roleText, sources },
    ]);
    await handleStreamRecursively();
  };
  await handleStreamRecursively();
};
