import { useState } from "react";
import { type RouterOutputs } from "@/utils/api";
import ReactMarkdown from "react-markdown";

type Snippet = RouterOutputs["snippet"]["getAll"][0];

export const SnippetCard = ({
  snippet,
  onDelete,
}: {
  snippet: Snippet;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title text-xl font-bold">
            {snippet.title}
          </div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{snippet.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        {isExpanded && (
          <div className="card-action mx-2 flex justify-end">
            <button
              className="btn-error btn-outline btn-xs btn px-5"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
