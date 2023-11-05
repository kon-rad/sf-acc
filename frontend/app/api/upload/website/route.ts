import { checkVideoDocumentsTableForId } from "@/lib/api/video_docs_data";
import { getYoutubeUrl } from "@/lib/helpers/youtube/getData";
import { getSupabaseClient } from "@/lib/utils/supabase";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

interface UploadType {
  userId: string;
}

export const POST = async (request: Request): Promise<Response> => {
  const res: UploadType = await request.json(); // res now contains body
  const { subect, url } = res;
  const supabase_db = getSupabaseClient();

  // const loader = YoutubeLoader.createFromUrl(fromURL, {
  //   language: "en",
  //   addVideoInfo: true,
  // });
  const docs = await loader.load();

  // check if it is indexed in video_docs_data
  const isIndexed = await checkVideoDocumentsTableForId(userId);
  let responseData: any = {};
  console.log("isIndexed", isIndexed);
  console.log("docs len", docs.length);

    // uncomment this when done with summarization - need to vectorize all transcripts
    await uploadDocs(docs);
    console.log("uploading docs now!!!!");

    return new Response(
      JSON.stringify({ message: "index successful", data: responseData })
    );
  }
};

export const splitDocuments = async (docs: any) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 750,
    chunkOverlap: 50,
  });

  const output = await splitter.splitDocuments(docs);
  console.log("splitDocuments output: ", output);

  return output;
};

/**
 * uploads to supabase  video_documents
 * @param docs
 * @returns
 */
export const uploadDocs = async (docs: any): Promise<any> => {
  const client = getSupabaseClient();

  const transformedDocs = await splitDocuments(docs);

  console.log("transformedDocs: ", transformedDocs);
  // console.log("transformedDocs len: ", transformedDocs.length);

  const vectorStore = await SupabaseVectorStore.fromDocuments(
    transformedDocs,
    new OpenAIEmbeddings(),
    {
      client,
      tableName: "video_documents",
      queryName: "match_video_documents",
    }
  );

  return vectorStore;
};
