import { useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { type RouterOutputs, api } from "@/utils/api";
import { Header } from "@/components/header/header";
import { SnippetEditor } from "@/components/snippetEditor/snippetEditor";
import { SnippetCard } from "@/components/snippetCard/snippetCard";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Snippet Vault</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        {sessionData?.user && <Content />}
      </main>
    </>
  );
}

type Topic = RouterOutputs["topic"]["getAll"][0];

const Content: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: sessionData } = useSession();

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => refetchTopics(),
  });

  const { data: snippets, refetch: refetchSnippets } =
    api.snippet.getAll.useQuery(
      {
        topicId: selectedTopic?.id ?? "",
      },
      {
        enabled: sessionData?.user !== undefined && selectedTopic !== null,
      }
    );

  const createSnippet = api.snippet.create.useMutation({
    onSuccess: () => {
      void refetchSnippets();
    },
  });

  const deleteSnippet = api.snippet.delete.useMutation({
    onSuccess: () => {
      void refetchSnippets();
    },
  });

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-56 bg-base-100 p-2">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="New Topic"
          className="input-bordered input input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({ title: e.currentTarget.value });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3">
        <div>
          {snippets?.map((snippet) => (
            <div key={snippet.id} className="mt-5">
              <SnippetCard
                snippet={snippet}
                onDelete={() => void deleteSnippet.mutate({ id: snippet.id })}
              />
            </div>
          ))}
        </div>

        <SnippetEditor
          onSave={({ title, content }) => {
            void createSnippet.mutate({
              title,
              content,
              topicId: selectedTopic?.id ?? "",
            });
          }}
        />
      </div>
    </div>
  );
};
