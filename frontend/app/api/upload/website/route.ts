import { checkVideoDocumentsTableForId } from "@/lib/api/video_docs_data";
import { getYoutubeUrl } from "@/lib/helpers/youtube/getData";
import { getSupabaseClient } from "@/lib/utils/supabase";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { ApifyDatasetLoader } from "langchain/document_loaders/web/apify_dataset";
import { Document } from "langchain/document";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

export const POST = async (request: Request): Promise<Response> => {
  const res: any = await request.json(); // res now contains body
  const { subject, url } = res;
  console.log("subject, url", subject, url);

  const supabase_db = getSupabaseClient();

  const loader = await ApifyDatasetLoader.fromActorCall(
    "apify/website-content-crawler",
    {
      startUrls: [{ url: url }],
    },
    {
      datasetMappingFunction: (item) => {
        console.log("url: ", item.url);

        return new Document({
          pageContent: (item.text || "") as string,
          metadata: { source: item.url },
        });
      },
      clientOptions: {
        token: process.env.APIFY_API_TOKEN,
      },
    }
  );

  const docs = await loader.load();

  console.log("docs len: ", docs.length);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 750,
    chunkOverlap: 50,
  });

  const transformedDocs = await splitter.splitDocuments(docs);
  // console.log("transformedDocs output : ", transformedDocs);
  console.log("transformedDocs len : ", transformedDocs.length);

  await SupabaseVectorStore.fromDocuments(
    transformedDocs,
    new OpenAIEmbeddings(),
    {
      client: supabase_db,
      tableName: "sfacc_documents",
      queryName: "match_sfacc_documents",
    }
  );

  return new Response(JSON.stringify({ message: "index successful" }));
};
