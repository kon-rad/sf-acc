import { getSupabaseClient } from "@/lib/utils/supabase";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  BytesOutputParser,
  StringOutputParser,
} from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { NextRequest, NextResponse } from "next/server";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

import axios from "axios";

const textToSpeech = async (inputText: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_KEY;
  const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

  console.log("text to speech called: ", inputText);

  const options = {
    method: "POST",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      "xi-api-key": `${API_KEY}`,
    },
    data: {
      text: inputText,
    },
    responseType: "arraybuffer",
  };

  const speechDetails = await axios.request(options);
  console.log("text to speech called: speechDetails", speechDetails);

  return speechDetails.data;
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, 
rephrase the follow up question to be a standalone question, in its original language.
{chat_history}

Follow Up Input: {question}
Standalone question:`;

// notes:
//
// Answer the question based on the following context and chat history about the Ai Engineer Summit.
// If you don't know something say you don't know it, don't make things up.

// this was the 2nd template version and the ai didn't respond anything, it wasn't good.

const MAYOR_ANSWER_TEMPLATE = `You are the London Breed, the Mayor of San Francisco. Answer the question in a helpful manner.
Use the context as a helpful source, if it doesn't help, that's okay just keep the conversation helpful.
Raised in the Western Addition neighborhood of San Francisco, you worked in government after college. You were elected to the Board of Supervisors in 2012 (taking office in January 2013), and elected its president in 2015.
As president of the Board, Breed, according to the city charter, you became the acting mayor of San Francisco following the death of Mayor Ed Lee. You served in this role from December 12, 2017, to January 23, 2018.
You won the San Francisco mayoral special election held on June 5, 2018. You are the first black woman, second black person after Willie Brown, and second woman after Dianne Feinstein to be elected mayor of San Francisco. You were sworn in as mayor on July 11, 2018.

Context: {context}

Chat history: {chat_history}

Question: {question}

Helpful answer:
`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    console.log("currentMessageContent", currentMessageContent);

    const searchAndLogKeywords = (messageContent: string): string => {
      const keywords = ["news", "mayor", "steve", "ilya"];

      let matchFound = "mayor";
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "i"); // case-insensitive match
        if (regex.test(messageContent)) {
          console.log(
            `Keyword "${keyword}" found in message: ${messageContent}`
          );
          matchFound = keyword;
        }
      });
      return matchFound;
    };
    let response = "hey lets try again";

    // Call the function to search for keywords and log if they are present
    const agentChosen = searchAndLogKeywords(currentMessageContent);
    if (agentChosen?.toLowerCase() === "news") {
      console.log("news agent picked");
      const response = await newsAgent(messages, userId);
      return new Response(
        JSON.stringify(response, {
          headers: {
            "x-message-index": (
              formattedPreviousMessages.length + 1
            ).toString(),
          },
        })
      );
    } else if (agentChosen?.toLowerCase() === "mayor") {
      console.log("mayor agent picked");
      await mayorAgent(messages, userId);
    } else if (agentChosen?.toLowerCase() === "steve") {
      console.log("steve agent picked");
    } else if (agentChosen?.toLowerCase() === "ilya") {
      console.log("ilya agent picked");
    } else {
      console.log("No keyword match found in the message. choosing mayor");
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

const newsAgent = async (messages: string, userId: string) => {
  // Define the model with stop tokens.
  // const model = new ChatAnthropic({ temperature: 0 }).bind({
  //   stop: ["</tool_input>", "</final_answer>"],
  // });
  try {
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const tools = [new Calculator(), new SerpAPI()];
    const chat = new ChatOpenAI({ modelName: "gpt-4", temperature: 0 });

    const executor = await initializeAgentExecutorWithOptions(tools, chat, {
      agentType: "openai-functions",
      verbose: true,
    });

    const result = await executor.run(
      currentMessageContent || "What is the weather in San Francisco?"
    );
    console.log("result of search: ", result);
    return result;

    // return new StreamingTextResponse(stream, {
    //   headers: {
    //     "x-message-index": (formattedPreviousMessages.length + 1).toString(),
    //   },
    // });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

const mayorAgent = async (messages: any, userId: any) => {
  try {
    const client = getSupabaseClient();

    console.log("messages: ", messages);
    console.log("userId: ", userId);
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    console.log("currentMessageContent", currentMessageContent);
    console.log("formattedPreviousMessages", formattedPreviousMessages);

    const condenseQuestionPrompt = PromptTemplate.fromTemplate(
      CONDENSE_QUESTION_TEMPLATE
    );
    const answerPrompt = PromptTemplate.fromTemplate(MAYOR_ANSWER_TEMPLATE);

    // const model = new ChatOpenAI({
    //   modelName: "gpt-3.5-turbo",
    //   temperature: 0.2,
    //   openAIApiKey: process.env.OPENAI_API_KEY,
    // });
    const model = new ChatAnthropic({
      temperature: 0.9,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "sfacc_documents",
      queryName: "match_sfacc_documents",
    });
    // initialize the standaloneQuestionChain
    // takes in: chat_history + question to generate the standalone question used for the document retrieval and question for the answerChain
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = vectorStore.asRetriever({
      // filter: { source: videoId },
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            // Filter documents based on metadata source property
            console.log("retrieved documents len: ", documents.length);
            // const filteredDocuments = documents.filter(
            //   (doc) => doc.metadata?.source === videoId
            // );
            // console.log("filteredDocuments len: ", filteredDocuments.length);

            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const combineDocumentsFn = (docs: Document[], separator = "\n\n") => {
      const serializedDocs = docs.map((doc) => doc.pageContent);
      return serializedDocs.join(separator);
    };

    // initialize the retrievalChain
    const retrievalChain = retriever.pipe(combineDocumentsFn);
    console.log("before answerChain");

    // initialize the answerChain - combines retrievalChain which gets the context documents
    // it invokes the retrievalChain
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);
    console.log("after answerChain");

    // conversationalRetrievalQAChain
    //    1st -> standaloneQuestionChain:
    //                        1. generates stand-alone question using chat_history + question
    //    2nd -> answerChain:
    //                        1 invokes retrievalChain with stand-alone question as query
    //                        2. invokes answerChain with context, chat_history & stand-alone question
    //          -> retrievalChain

    // initialize the conversationalRetrievalQAChain
    // it invokes the answerChain
    // it invokes the standaloneQuestionChain
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);
    console.log("after conversationalRetrievalQAChain");
    console.log("currentMessageContent", currentMessageContent);
    console.log("formattedPreviousMessages", formattedPreviousMessages);

    const stream = await conversationalRetrievalQAChain
      .stream({
        question: currentMessageContent,
        chat_history: formattedPreviousMessages,
      })
      .catch((e) => console.error("Error with stream:", e));
    console.log("got here 1 ");

    // const textRes = await conversationalRetrievalQAChain
    //   .invoke({
    //     question: currentMessageContent,
    //     chat_history: formattedPreviousMessages,
    //   })
    //   .catch((e) => console.error("Error with stream:", e));
    // console.log("got here 1 textRes ", textRes);

    // const resultTwo = await chain.invoke({
    //   chatHistory: formatChatHistory(resultOne, questionOne),
    //   question: "Was it
    // // const documents = await documentPromise;
    console.log("got here");

    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent,
            metadata: doc.metadata,
          };
        })
      )
    ).toString("base64");

    return new StreamingTextResponse(stream, {
      headers: {
        "x-message-index": (formattedPreviousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
