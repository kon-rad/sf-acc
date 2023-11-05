import { getSupabaseClient } from "@/lib/utils/supabase";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
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

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
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

const ANSWER_TEMPLATE = `You are the expert bot on the AI Engineer Summit. You have all the information anyone would ever need on the Summit. Answer the question in a helpful manner.
Only use the context you know about the video to answer the question. Don't make things up.
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
    const client = getSupabaseClient();

    console.log("messages: ", messages);
    console.log("userId: ", userId);
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const condenseQuestionPrompt = PromptTemplate.fromTemplate(
      CONDENSE_QUESTION_TEMPLATE
    );
    const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

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
      filter: { source: videoId },
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            // Filter documents based on metadata source property
            console.log("retrieved documents len: ", documents.length);
            const filteredDocuments = documents.filter(
              (doc) => doc.metadata?.source === videoId
            );
            console.log("filteredDocuments len: ", filteredDocuments.length);

            resolveWithDocuments(filteredDocuments);
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

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formattedPreviousMessages,
    });

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
}
