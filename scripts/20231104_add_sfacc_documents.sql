create table
  public.sfacc_documents (
    id bigserial,
    content text null,
    metadata jsonb null,
    embedding public.vector null,
    constraint sfacc_documents_pkey primary key (id)
  ) tablespace pg_default;

-- Create a function to search for documents
create function match_sfacc_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
