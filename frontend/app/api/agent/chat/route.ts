import { DynamicTool, DynamicStructuredTool } from "langchain/tools";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { WikipediaQueryRun } from "langchain/tools";
import { StreamingTextResponse } from "ai";
// import * as z from "zod";
import { AgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { pull } from "langchain/hub";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { AgentStep, BaseMessage } from "langchain/schema";
import { BufferMemory } from "langchain/memory";
import { formatLogToString } from "langchain/agents/format_scratchpad/log";
import { renderTextDescription } from "langchain/tools/render";
import { ReActSingleInputOutputParser } from "langchain/agents/react/output_parser";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(req: Request, res: Response) {
  const { messages, userId } = await req.json();
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;
  const message_history = messages.slice(0, messages.length - 1);
  console.log("agent chat vals: ", messages, userId);
  console.log("currentMessageContent ", currentMessageContent);

  // const model = new ChatOpenAI({ temperature: 0, streaming: true });

  // const wikipediaQuery = new WikipediaQueryRun({
  //   topKResults: 1,
  //   maxDocContentLength: 300,
  // });

  // const foo = new DynamicTool({
  //   name: "foo",
  //   description: "returns the answer to what foo is",
  //   func: async () => {
  //     console.log("Triggered foo function");
  //     return 'The value of food is "This is a demo for YouTube"';
  //   },
  // });

  // 8. Define a structured tool to fetch cryptocurrency prices from CoinGecko API
  // const fetchCryptoPrice = new DynamicStructuredTool({
  //   name: 'fetchCryptoPrice',
  //   description: 'Fetches the current price of a specified cryptocurrency',
  //   schema: z.object({
  //     cryptoName: z.string(),
  //     vsCurrency: z.string().optional().default('USD'),
  //   }),
  //   func: async (options) => {
  //     console.log('Triggered fetchCryptoPrice function with options: ', options);
  //     const { cryptoName, vsCurrency } = options;
  //     const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=${vsCurrency}`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     return data[cryptoName.toLowerCase()][vsCurrency.toLowerCase()].toString();
  //   },
  // });

  // const tools = [wikipediaQuery, foo];

  // const executor = await initializeAgentExecutorWithOptions(tools, model, {
  //   agentType: "openai-functions",
  // });

  // const input = messages[messages.length - 1].content;

  // const result = await executor.run(input);
  // ----- end agent tut 1

  const model = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  /** Bind a stop token to the model */
  const modelWithStop = model.bind({
    stop: ["\nObservation"],
  });
  /** Define your list of tools */
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "San Francisco,California ,United States",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];
  /**
   * Pull a prompt from LangChain Hub
   * @link https://smith.langchain.com/hub/hwchase17/react-chat
   */
  const prompt = await pull<PromptTemplate>("hwchase17/react-chat");
  /** Add input variables to prompt */
  const toolNames = tools.map((tool) => tool.name);
  const promptWithInputs = await prompt.partial({
    tools: renderTextDescription(tools),
    tool_names: toolNames.join(","),
  });

  const runnableAgent = RunnableSequence.from([
    {
      input: (i: {
        input: string;
        steps: AgentStep[];
        chat_history: BaseMessage[];
      }) => i.input,
      agent_scratchpad: (i: {
        input: string;
        steps: AgentStep[];
        chat_history: BaseMessage[];
      }) => formatLogToString(i.steps),
      chat_history: (i: {
        input: string;
        steps: AgentStep[];
        chat_history: BaseMessage[];
      }) => i.chat_history,
    },
    promptWithInputs,
    modelWithStop,
    new ReActSingleInputOutputParser({ toolNames }),
  ]);

  /**
   * Define your memory store
   * @important The memoryKey must be "chat_history" for the chat agent to work
   * because this is the key this particular prompt expects.
   */
  const memory = new BufferMemory({ memoryKey: "chat_history" });

  /** Define your executor and pass in the agent, tools and memory */
  const executor = AgentExecutor.fromAgentAndTools({
    agent: runnableAgent,
    tools,
    memory,
    verbose: true,
  });

  console.log("Loaded agent.");

  // const input0 = `hi, i am  user number: ${userId} messages, userId`;

  const result = await executor.call({
    input: currentMessageContent,
    chat_history: formattedPreviousMessages,
  });
  console.log(`Got output ${result.output}`);
  console.log("result: ", result);
  // ----- end agent jlang tut 2

  // process.env.LANGCHAIN_HANDLER = "langchain";
  // // const model = new ChatOpenAI({ temperature: 0 });
  // const model = new ChatOpenAI({
  //   modelName: "gpt-4",
  //   temperature: 0,
  //   openAIApiKey: process.env.OPENAI_API_KEY,
  // });
  // const tools = [
  //   new SerpAPI(process.env.SERPAPI_API_KEY, {
  //     location: "Austin,Texas,United States",
  //     hl: "en",
  //     gl: "us",
  //   }),
  //   new Calculator(),
  // ];

  // // Passing "chat-conversational-react-description" as the agent type
  // // automatically creates and uses BufferMemory with the executor.
  // // If you would like to override this, you can pass in a custom
  // // memory option, but the memoryKey set on it must be "chat_history".
  // const executor = await initializeAgentExecutorWithOptions(tools, model, {
  //   agentType: "chat-conversational-react-description",
  //   verbose: true,
  // });
  // console.log("Loaded agent.");

  // const input = `hi, i am  user number: ${userId} messages, userId`;

  // const result = await executor.call({
  //   input: input,
  //   chat_history: formattedPreviousMessages,
  // });
  // console.log("result: ", result, message_history);

  const chunks = result.output.split(" ");

  const responseStream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const bytes = new TextEncoder().encode(chunk + " ");
        controller.enqueue(bytes);
        await new Promise((r) =>
          setTimeout(r, Math.floor(Math.random() * 20 + 10))
        );
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(responseStream);
}
